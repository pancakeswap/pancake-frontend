import fs from 'fs'
import os from 'os'
import { request, gql } from 'graphql-request'
import BigNumber from 'bignumber.js'
import chunk from 'lodash/chunk'
import _toLower from 'lodash/toLower'
import dayjs from 'dayjs'
import { ChainId, getChainName } from '@pancakeswap/chains'
import { SerializedFarmConfig } from '@pancakeswap/farms'
import { BlockResponse } from '../apps/web/src/components/SubgraphHealthIndicator'
import { BLOCKS_CLIENT_WITH_CHAIN } from '../apps/web/src/config/constants/endpoints'
import { stableSwapClient, infoClientWithChain } from '../apps/web/src/utils/graphql'

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
  return dayjs().subtract(1, 'weeks').unix()
}

const LP_HOLDERS_FEE = 0.0017
const WEEKS_IN_A_YEAR = 52.1429

const getBlockAtTimestamp = async (timestamp: number, chainId = ChainId.BSC) => {
  try {
    const { blocks } = await request<BlockResponse>(
      BLOCKS_CLIENT_WITH_CHAIN[chainId],
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

const getAprsForFarmGroup = async (addresses: string[], blockWeekAgo: number, chainId: number): Promise<AprMap> => {
  try {
    const { farmsAtLatestBlock, farmsOneWeekAgo } = await infoClientWithChain(chainId).request<FarmsResponse>(
      gql`
        query farmsBulk($addresses: [ID!], $blockWeekAgo: Int!) {
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

interface SplitFarmResult {
  normalFarms: any[]
  stableFarms: any[]
}

export const BLOCKS_PER_DAY = (60 / 3) * 60 * 24

const getAprsForStableFarm = async (stableFarm: any): Promise<BigNumber> => {
  const stableSwapAddress = stableFarm?.stableSwapAddress

  try {
    const day3Ago = dayjs().subtract(3, 'days')
    const day7Ago = dayjs().subtract(7, 'days')

    const day3AgoTimestamp = day3Ago.unix()
    const day7AgoTimestamp = day7Ago.unix()

    const [block3DaysAgo, block7DaysAgo] = await Promise.all([
      getBlockAtTimestamp(day3AgoTimestamp),
      getBlockAtTimestamp(day7AgoTimestamp),
    ])

    const { virtualPriceAtLatestBlock, virtualPrice3DaysAgo, virtualPrice7DaysAgo } = await stableSwapClient.request(
      gql`
        query virtualPriceStableSwap($stableSwapAddress: String, $block3DaysAgo: Int!, $block7DaysAgo: Int!) {
          virtualPriceAtLatestBlock: pair(id: $stableSwapAddress) {
            virtualPrice
          }
          virtualPrice3DaysAgo: pair(id: $stableSwapAddress, block: { number: $block3DaysAgo }) {
            virtualPrice
          }
          virtualPrice7DaysAgo: pair(id: $stableSwapAddress, block: { number: $block7DaysAgo }) {
            virtualPrice
          }
        }
      `,
      { stableSwapAddress: _toLower(stableSwapAddress), block7DaysAgo, block3DaysAgo },
    )

    const virtualPrice = virtualPriceAtLatestBlock?.virtualPrice
    const preVirtualPrice =
      !virtualPrice7DaysAgo?.virtualPrice || virtualPrice7DaysAgo?.virtualPrice === '0'
        ? virtualPrice3DaysAgo?.virtualPrice
        : virtualPrice7DaysAgo?.virtualPrice

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

const FETCH_CHAIN_ID = [ChainId.BSC, ChainId.ETHEREUM]
const fetchAndUpdateLPsAPR = async () => {
  Promise.all(
    FETCH_CHAIN_ID.map(async (chainId) => {
      const farmsConfig = await getFarmConfig(chainId)
      const { normalFarms, stableFarms }: SplitFarmResult = farmsConfig.reduce(splitNormalAndStableFarmsReducer, {
        normalFarms: [],
        stableFarms: [],
      })

      const lowerCaseAddresses = normalFarms.map((farm) => farm.lpAddress.toLowerCase())
      console.info(`Fetching farm data for ${lowerCaseAddresses.length} addresses`)
      // Split it into chunks of 30 addresses to avoid gateway timeout
      const addressesInGroups = chunk(lowerCaseAddresses, 30)
      const weekAgoTimestamp = getWeekAgoTimestamp()
      const blockWeekAgo = await getBlockAtTimestamp(weekAgoTimestamp, chainId)

      let allAprs: AprMap = {}
      // eslint-disable-next-line no-restricted-syntax
      for (const groupOfAddresses of addressesInGroups) {
        // eslint-disable-next-line no-await-in-loop
        const aprs = await getAprsForFarmGroup(groupOfAddresses, blockWeekAgo, chainId)
        allAprs = { ...allAprs, ...aprs }
      }

      try {
        if (stableFarms?.length) {
          const stableAprs: BigNumber[] = await Promise.all(stableFarms.map((f) => getAprsForStableFarm(f)))

          const stableAprsMap = stableAprs.reduce(
            (result, apr, index) => ({
              ...result,
              [stableFarms[index].lpAddress]: apr.decimalPlaces(5).toNumber(),
            }),
            {} as AprMap,
          )

          allAprs = { ...allAprs, ...stableAprsMap }
        }
      } catch (error) {
        console.error(error, '[LP APR Update] getAprsForStableFarm error')
      }

      fs.writeFile(
        `apps/web/src/config/constants/lpAprs/${chainId}.json`,
        JSON.stringify(allAprs, null, 2) + os.EOL,
        (err) => {
          if (err) throw err
          console.info(` ✅ - lpAprs.json has been updated!`)
        },
      )
    }),
  )
}

let logged = false
export const getFarmConfig = async (chainId: ChainId) => {
  const chainName = getChainName(chainId)
  try {
    return (await import(`../packages/farms/constants/${chainName}`)).default.filter(
      (f: SerializedFarmConfig) => f.pid !== null,
    ) as SerializedFarmConfig[]
  } catch (error) {
    if (!logged) {
      console.error('Cannot get farm config', error, chainId, chainName)
      logged = true
    }
    return []
  }
}

fetchAndUpdateLPsAPR()
