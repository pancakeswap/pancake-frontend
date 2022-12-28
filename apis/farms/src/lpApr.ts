/* eslint-disable no-restricted-syntax */
import { ChainId } from '@pancakeswap/sdk'
import chunk from 'lodash/chunk'
import BigNumber from 'bignumber.js'
import { gql, GraphQLClient } from 'graphql-request'
import getUnixTime from 'date-fns/getUnixTime'
import sub from 'date-fns/sub'
import { AprMap } from '@pancakeswap/farms'
import _toLower from 'lodash/toLower'

interface BlockResponse {
  blocks: {
    number: string
  }[]
}

const STABLESWAP_SUBGRAPH_ENDPOINT = 'https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-stableswap'

const LP_HOLDERS_FEE = 0.0017
const WEEKS_IN_A_YEAR = 52.1429

const BLOCKS_CLIENT_WITH_CHAIN = {
  [ChainId.BSC]: 'https://api.thegraph.com/subgraphs/name/pancakeswap/blocks',
  [ChainId.ETHEREUM]: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks',
  [ChainId.BSC_TESTNET]: '',
  [ChainId.GOERLI]: '',
}

const INFO_CLIENT_WITH_CHAIN = {
  [ChainId.BSC]: 'https://proxy-worker.pancake-swap.workers.dev/bsc-exchange',
  [ChainId.ETHEREUM]: 'https://api.thegraph.com/subgraphs/name/pancakeswap/exhange-eth',
  [ChainId.BSC_TESTNET]: '',
  [ChainId.GOERLI]: '',
}

const blockClientWithChain = (chainId: ChainId) => {
  return new GraphQLClient(BLOCKS_CLIENT_WITH_CHAIN[chainId], {
    fetch,
  })
}

const infoClientWithChain = (chainId: ChainId) => {
  return new GraphQLClient(INFO_CLIENT_WITH_CHAIN[chainId], {
    fetch,
  })
}

const stableSwapClient = new GraphQLClient(STABLESWAP_SUBGRAPH_ENDPOINT, {
  fetch,
})

const getWeekAgoTimestamp = () => {
  const weekAgo = sub(new Date(), { weeks: 1 })
  return getUnixTime(weekAgo)
}

const getBlockAtTimestamp = async (timestamp: number, chainId = ChainId.BSC) => {
  try {
    const { blocks } = await blockClientWithChain(chainId).request<BlockResponse>(
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

const getAprsForFarmGroup = async (addresses: string[], blockWeekAgo: number, chainId: number): Promise<AprMap> => {
  try {
    const { farmsAtLatestBlock, farmsOneWeekAgo } = await infoClientWithChain(chainId).request<FarmsResponse>(
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

// Stable Logic

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

export const BLOCKS_PER_DAY = (60 / 3) * 60 * 24

const getAprsForStableFarm = async (stableFarm: any): Promise<BigNumber> => {
  const stableSwapAddress = stableFarm?.stableSwapAddress

  try {
    const day7Ago = sub(new Date(), { days: 7 })

    const day7AgoTimestamp = getUnixTime(day7Ago)

    const blockDay7Ago = await getBlockAtTimestamp(day7AgoTimestamp)

    const { virtualPriceAtLatestBlock, virtualPriceOneDayAgo: virtualPrice7DayAgo } = await stableSwapClient.request(
      gql`
        query virtualPriceStableSwap($stableSwapAddress: String, $blockDayAgo: Int!) {
          virtualPriceAtLatestBlock: pair(id: $stableSwapAddress) {
            virtualPrice
          }
          virtualPriceOneDayAgo: pair(id: $stableSwapAddress, block: { number: $blockDayAgo }) {
            virtualPrice
          }
        }
      `,
      { stableSwapAddress: _toLower(stableSwapAddress), blockDayAgo: blockDay7Ago },
    )

    const virtualPrice = virtualPriceAtLatestBlock?.virtualPrice
    const preVirtualPrice = virtualPrice7DayAgo?.virtualPrice

    const current = new BigNumber(virtualPrice)
    const prev = new BigNumber(preVirtualPrice)

    const result = current.minus(prev).div(current).plus(1).pow(52).minus(1).times(100)

    if (result.isFinite() && result.isGreaterThan(0)) {
      return result
    }
    return new BigNumber(0)
  } catch (error) {
    console.error(error, '[LP APR Update] getAprsForStableFarm error')
  }

  return new BigNumber('0')
}

// ====

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
    blockWeekAgo = await getBlockAtTimestamp(weekAgoTimestamp, chainId)
  } catch (error) {
    console.error(error, 'LP APR Update] blockWeekAgo error')
    return false
  }

  let allAprs: AprMap = {}
  try {
    for (const groupOfAddresses of addressesInGroups) {
      // eslint-disable-next-line no-await-in-loop
      const aprs = await getAprsForFarmGroup(groupOfAddresses, blockWeekAgo, chainId)
      allAprs = { ...allAprs, ...aprs }
    }
  } catch (error) {
    console.error(error, '[LP APR Update] getAprsForFarmGroup error')
    return false
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

  try {
    return allAprs
  } catch (error) {
    console.error(error, '[LP APR Update] Failed to save LP APRs to redis')
    return false
  }
}
