import fs from 'fs'
import os from 'os'
import { request, gql } from 'graphql-request'
import BigNumber from 'bignumber.js'
import chunk from 'lodash/chunk'
import { sub, getUnixTime } from 'date-fns'
import farmsConfig from '@pancakeswap/farms/constants/56'
import { Contract } from '@ethersproject/contracts'
import { StaticJsonRpcProvider } from '@ethersproject/providers'
import type { BlockResponse } from '../src/components/SubgraphHealthIndicator'
import { BLOCKS_CLIENT } from '../src/config/constants/endpoints'
import { infoClient } from '../src/utils/graphql'

const BLOCK_SUBGRAPH_ENDPOINT = BLOCKS_CLIENT

interface SingleFarmResponse {
  id: string
  reserveUSD: string
  volumeUSD: string
}

interface FarmsResponse {
  farmsAtLatestBlock: SingleFarmResponse[]
  farmsOneWeekAgo: SingleFarmResponse[]
}

interface AprMap {
  [key: string]: BigNumber
}

const getWeekAgoTimestamp = () => {
  const weekAgo = sub(new Date(), { weeks: 1 })
  return getUnixTime(weekAgo)
}

const LP_HOLDERS_FEE = 0.0017
const WEEKS_IN_A_YEAR = 52.1429

const getBlockAtTimestamp = async (timestamp: number) => {
  try {
    const { blocks } = await request<BlockResponse>(
      BLOCK_SUBGRAPH_ENDPOINT,
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
    const aprs: AprMap = farmsAtLatestBlock.reduce((aprMap, farm) => {
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
    return aprs
  } catch (error) {
    throw new Error(`Failed to fetch LP APR data: ${error}`)
  }
}

// Copy paste of Stable farm logic
export const bscProvider = new StaticJsonRpcProvider(
  {
    url: 'https://bsc-mainnet.nodereal.io/v1/5a516406afa140ffa546ee10af7c9b24',
    skipFetchSetup: true,
  },
  56,
)

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

interface SplitFarmResult {
  normalFarms: any[]
  stableFarms: any[]
}

export const BLOCKS_PER_DAY = (60 / 3) * 60 * 24

const getAprsForStableFarm = async (stableFarm: any): Promise<BigNumber> => {
  const swapContract = new Contract(stableFarm?.stableSwapAddress, stableSwapABI)

  const latest: number = parseInt((await bscProvider.getBlockNumber())?.toString(), 10)

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
// ====

const fetchAndUpdateLPsAPR = async () => {
  const { normalFarms, stableFarms }: SplitFarmResult = farmsConfig.reduce(splitNormalAndStableFarmsReducer, {
    normalFarms: [],
    stableFarms: [],
  })

  const lowerCaseAddresses = normalFarms.map((farm) => farm.lpAddress.toLowerCase())
  console.info(`Fetching farm data for ${lowerCaseAddresses.length} addresses`)
  // Split it into chunks of 30 addresses to avoid gateway timeout
  const addressesInGroups = chunk(lowerCaseAddresses, 30)
  const weekAgoTimestamp = getWeekAgoTimestamp()
  const blockWeekAgo = await getBlockAtTimestamp(weekAgoTimestamp)

  let allAprs: AprMap = {}
  // eslint-disable-next-line no-restricted-syntax
  for (const groupOfAddresses of addressesInGroups) {
    // eslint-disable-next-line no-await-in-loop
    const aprs = await getAprsForFarmGroup(groupOfAddresses, blockWeekAgo)
    allAprs = { ...allAprs, ...aprs }
  }

  try {
    if (stableFarms?.length) {
      const stableAprs: BigNumber[] = await Promise.all(stableFarms.map((f) => getAprsForStableFarm(f)))

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

  fs.writeFile(`src/config/constants/lpAprs/56.json`, JSON.stringify(allAprs, null, 2) + os.EOL, (err) => {
    if (err) throw err
    console.info(` ✅ - lpAprs.json has been updated!`)
  })
}

fetchAndUpdateLPsAPR()
