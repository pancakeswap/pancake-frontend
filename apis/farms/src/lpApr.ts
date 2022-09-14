/* eslint-disable no-restricted-syntax */
import chunk from 'lodash/chunk'
import BigNumber from 'bignumber.js'
import { gql, GraphQLClient } from 'graphql-request'
import getUnixTime from 'date-fns/getUnixTime'
import sub from 'date-fns/sub'
import { AprMap } from '@pancakeswap/farms'
import { Contract } from '@ethersproject/contracts'
import { getProvider } from './helper'

interface BlockResponse {
  blocks: {
    number: string
  }[]
}

const BLOCK_SUBGRAPH_ENDPOINT = 'https://api.thegraph.com/subgraphs/name/pancakeswap/blocks'
const INFO_SUBGRAPH_ENDPOINT = 'https://bsc.streamingfast.io/subgraphs/name/pancakeswap/exchange-v2'

const LP_HOLDERS_FEE = 0.0017
const WEEKS_IN_A_YEAR = 52.1429

const infoClient = new GraphQLClient(INFO_SUBGRAPH_ENDPOINT, {
  fetch,
})

const blockClient = new GraphQLClient(BLOCK_SUBGRAPH_ENDPOINT, {
  fetch,
})

const stableSwapABI = [
  {
    inputs: [],
    name: 'get_virtual_price',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

const getWeekAgoTimestamp = () => {
  const weekAgo = sub(new Date(), { weeks: 1 })
  return getUnixTime(weekAgo)
}

const getDayAgoTimestamp = () => {
  const dayAgo = sub(new Date(), { days: 1 })
  return getUnixTime(dayAgo)
}

const getBlockAtTimestamp = async (timestamp: number) => {
  try {
    const { blocks } = await blockClient.request<BlockResponse>(
      `query getBlock($timestampGreater: Int!, $timestampLess: Int!) {
        blocks(first: 1, where: { timestamp_gt: $timestampGreater, timestamp_lt: $timestampLess }) {
          number
        }
      }`,
      { timestampGreater: timestamp, timestampLess: timestamp + 600 },
    )
    return parseInt(blocks[0].number, 10)
  } catch (error) {
    throw new Error(`Failed to fetch block number for ${timestamp}\n${error}`)
  }
}

interface SingleFarmResponse {
  id: string
  reserveUSD: string
  volumeUSD: string
}

interface FarmsResponse {
  farmsAtLatestBlock: SingleFarmResponse[]
  farmsOneWeekAgo: SingleFarmResponse[]
}

export const BLOCKS_PER_DAY = (60 / 3) * 60 * 24

const getAprsForStableFarm = async (stableFarm: any, chainId: number): Promise<BigNumber> => {
  const provider = getProvider({ chainId })
  if (!provider) throw new Error(`Provider missing chainId ${chainId}`)
  const swapContract = new Contract(stableFarm?.stableSwapAddress, stableSwapABI)

  const latest: number = parseInt((await provider.getBlockNumber())?.toString(), 10)

  const virtualPrice = await swapContract.get_virtual_price()

  let preVirtualPrice

  try {
    preVirtualPrice = await swapContract.get_virtual_price({ blockTag: latest - BLOCKS_PER_DAY })
  } catch (e) {
    preVirtualPrice = 1 * 10 ** 18
  }

  const current = new BigNumber(virtualPrice?.toString())
  const prev = new BigNumber(preVirtualPrice?.toString())

  return current.minus(prev).div(prev)
}

const getAprsForFarmGroup = async (addresses: string[], blockWeekAgo: number): Promise<AprMap> => {
  try {
    const { farmsAtLatestBlock, farmsOneWeekAgo } = await infoClient.request<FarmsResponse>(
      gql`
        query farmsBulk($addresses: [String]!, $blockWeekAgo: Int!) {
          farmsAtLatestBlock: pairs(first: 30, where: { id_in: $addresses }) {
            id
            volumeUSD
            reserveUSD
          }
          farmsOneWeekAgo: pairs(first: 30, where: { id_in: $addresses }, block: { number: $blockWeekAgo }) {
            id
            volumeUSD
            reserveUSD
          }
        }
      `,
      { addresses, blockWeekAgo },
    )
    return farmsAtLatestBlock.reduce((aprMap, farm) => {
      const farmWeekAgo = farmsOneWeekAgo.find((oldFarm) => oldFarm.id === farm.id)
      // In case farm is too new to estimate LP APR (i.e. not returned in farmsOneWeekAgo query) - return 0
      let lpApr = new BigNumber(0)
      if (farmWeekAgo) {
        const volume7d = new BigNumber(farm.volumeUSD).minus(new BigNumber(farmWeekAgo.volumeUSD))
        const lpFees7d = volume7d.times(LP_HOLDERS_FEE)
        const lpFeesInAYear = lpFees7d.times(WEEKS_IN_A_YEAR)
        // Some untracked pairs like KUN-QSD will report 0 volume
        if (lpFeesInAYear.gt(0)) {
          const liquidity = new BigNumber(farm.reserveUSD)
          lpApr = lpFeesInAYear.times(100).dividedBy(liquidity)
        }
      }
      return {
        ...aprMap,
        [farm.id]: lpApr.decimalPlaces(2).toNumber(),
      }
    }, {})
  } catch (error) {
    throw new Error(`[LP APR Update] Failed to fetch LP APR data: ${error}`)
  }
}

interface SplitFarmResult {
  normalFarms: any[]
  stableFarms: any[]
}

function splitNormalAndStableFarmsReducer(result: SplitFarmResult, farm: any): SplitFarmResult {
  const { normalFarms, stableFarms } = result

  if (farm?.stableSwapAddress) {
    return {
      normalFarms,
      stableFarms: [...stableFarms, farm],
    }
  }

  return {
    stableFarms,
    normalFarms: [...normalFarms, farm],
  }
}

export const updateLPsAPR = async (chainId: number, allFarms: any[]) => {
  const { normalFarms, stableFarms }: SplitFarmResult = allFarms.reduce(splitNormalAndStableFarmsReducer, {
    normalFarms: [],
    stableFarms: [],
  })

  const lowerCaseAddresses = normalFarms.map((farm) => farm.lpAddress.toLowerCase())
  console.info(`[LP APR Update] Fetching farm data for ${lowerCaseAddresses.length} addresses`)
  // Split it into chunks of 30 addresses to avoid gateway timeout
  const addressesInGroups = chunk<string>(lowerCaseAddresses, 30)
  const weekAgoTimestamp = getWeekAgoTimestamp()

  let blockWeekAgo: number
  try {
    blockWeekAgo = await getBlockAtTimestamp(weekAgoTimestamp)
  } catch (error) {
    console.error(error, 'LP APR Update] blockWeekAgo error')
    return false
  }

  let allAprs: AprMap = {}
  try {
    for (const groupOfAddresses of addressesInGroups) {
      // eslint-disable-next-line no-await-in-loop
      const aprs = await getAprsForFarmGroup(groupOfAddresses, blockWeekAgo)
      allAprs = { ...allAprs, ...aprs }
    }
  } catch (error) {
    console.error(error, '[LP APR Update] getAprsForFarmGroup error')
    return false
  }

  try {
    if (stableFarms?.length) {
      const stableAprs: BigNumber[] = await Promise.all(stableFarms.map((f) => getAprsForStableFarm(f, chainId)))

      const stableAprsMap = stableAprs.reduce(
        (result, apr, index) => ({
          ...result,
          [stableFarms[index].lpAddress]: apr.decimalPlaces(2).toNumber(),
        }),
        {} as AprMap,
      )

      allAprs = { ...allAprs, ...stableAprsMap }
    }
  } catch (error) {
    console.error(error, '[LP APR Update] getAprsForStableFarm error')
  }

  try {
    return allAprs
  } catch (error) {
    console.error(error, '[LP APR Update] Failed to save LP APRs to redis')
    return false
  }
}
