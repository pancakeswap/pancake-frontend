/* eslint-disable no-restricted-syntax */
import chunk from 'lodash/chunk'
import { gql, GraphQLClient } from 'graphql-request'
import getUnixTime from 'date-fns/getUnixTime'
import sub from 'date-fns/sub'
import { AprMap } from '@pancakeswap/farms'
import { FIXED_ZERO } from '@pancakeswap/farms/src/const'
import { FixedNumber } from '@ethersproject/bignumber'
import { getAddress } from '@ethersproject/address'

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

const getWeekAgoTimestamp = () => {
  const weekAgo = sub(new Date(), { weeks: 1 })
  return getUnixTime(weekAgo)
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
      let lpApr = FIXED_ZERO
      if (farmWeekAgo) {
        const volume7d = FixedNumber.from(farm.volumeUSD).subUnsafe(FixedNumber.from(farmWeekAgo.volumeUSD))
        const lpFees7d = volume7d.mulUnsafe(FixedNumber.from(LP_HOLDERS_FEE))
        const lpFeesInAYear = lpFees7d.mulUnsafe(FixedNumber.from(WEEKS_IN_A_YEAR))
        // Some untracked pairs like KUN-QSD will report 0 volume
        if (!lpFeesInAYear.isZero() && !lpFeesInAYear.isNegative()) {
          const liquidity = FixedNumber.from(farm.reserveUSD)
          lpApr = lpFeesInAYear.mulUnsafe(FixedNumber.from(100)).divUnsafe(liquidity)
        }
      }
      return {
        ...aprMap,
        [getAddress(farm.id)]: lpApr.toString(),
      }
    }, {})
  } catch (error) {
    throw new Error(`[LP APR Update] Failed to fetch LP APR data: ${error}`)
  }
}
export const updateLPsAPR = async (chainId: number, allFarms: any[]) => {
  const lowerCaseAddresses = allFarms.map((farm) => farm.lpAddress.toLowerCase())
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
    return allAprs
  } catch (error) {
    console.error(error, '[LP APR Update] Failed to save LP APRs to redis')
    return false
  }
}
