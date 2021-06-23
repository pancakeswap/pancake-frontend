import fs from 'fs'
import { request, gql } from 'graphql-request'
import BigNumber from 'bignumber.js'
import { ChainId } from '@pancakeswap-libs/sdk'
import chunk from 'lodash/chunk'
import farmsConfig from '../../src/config/constants/farms'

const BLOCK_SUBGRAPH = 'https://api.thegraph.com/subgraphs/name/pancakeswap/blocks'
const STREAMING_FAST = 'https://bsc.streamingfast.io/subgraphs/name/pancakeswap/exchange-v2'

const GET_BLOCK = (timestamp: string) => {
  return gql`query getBlock {
        blocks(first: 1, where: { timestamp_gt: ${timestamp}, timestamp_lt: ${timestamp + 600} }) {
          number
        }
    }`
}

const FARMS_AT_BLOCK = (block: number | null, farms: string[]) => {
  const blockString = block ? `block: {number: ${block}}` : ``
  const addressesString = `["${farms.join('","')}"]`
  return `pairs(
      first: 30,
      where: { id_in: ${addressesString} }
      ${blockString}
    ) {
      id
      volumeUSD
      reserveUSD
    }`
}

const FARMS_BULK = (blockWeekAgo: number, farms: string[]) => {
  return gql`
      query farmsBulk {
        now: ${FARMS_AT_BLOCK(null, farms)}
        oneWeekAgo: ${FARMS_AT_BLOCK(blockWeekAgo, farms)}
      }
    `
}

interface BlockResponse {
  blocks: {
    number: number
  }[]
}

interface SingleFarmResponse {
  id: string
  reserveUSD: string
  volumeUSD: string
}

interface FarmsResponse {
  now: SingleFarmResponse[]
  oneWeekAgo: SingleFarmResponse[]
}

interface AprMap {
  [key: string]: BigNumber
}

const getWeekAgoTimestamp = () => {
  const weekAgoMs = new Date().getTime() - 7 * 24 * 60 * 60 * 1000
  const weekAgoUnix = new Date(weekAgoMs).getTime() / 1000
  return Math.floor(weekAgoUnix).toString()
}

const LP_HOLDERS_FEE = 0.0017
const WEEKS_IN_A_YEAR = 52.1429

const get7dBlock = async () => {
  const weekAgoTimestamp = getWeekAgoTimestamp()
  try {
    const { blocks } = await request<BlockResponse>(BLOCK_SUBGRAPH, GET_BLOCK(weekAgoTimestamp))
    return blocks[0].number
  } catch (error) {
    throw new Error(`Failed to fetch block number for ${weekAgoTimestamp}\n${error}`)
  }
}

const getChunkApr = async (addresses: string[], blockWeekAgo: number): Promise<AprMap> => {
  try {
    const { now, oneWeekAgo } = await request<FarmsResponse>(STREAMING_FAST, FARMS_BULK(blockWeekAgo, addresses))
    const aprs: AprMap = now.reduce((aprMap, farm) => {
      const farmWeekAgo = oneWeekAgo.find((oldFarm) => oldFarm.id === farm.id)
      // In case farm is too new to estimate LP APR (i.e. not returned in oneWeekAgo query) - return 0
      let lpApr = new BigNumber(0)
      if (farmWeekAgo) {
        const volume7d = new BigNumber(farm.volumeUSD).minus(new BigNumber(farmWeekAgo.volumeUSD))
        const lpFees7d = volume7d.times(LP_HOLDERS_FEE)
        const lpFeesInAYear = lpFees7d.times(WEEKS_IN_A_YEAR)
        const liquidity = new BigNumber(farm.reserveUSD)
        lpApr = liquidity.dividedBy(lpFeesInAYear)
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

const fetchAndUpdateLPsAPR = async () => {
  const lowerCaseAddresses = farmsConfig
    .filter((farm) => farm.pid > 250)
    .map((farm) => farm.lpAddresses[ChainId.MAINNET].toLowerCase())
  console.info(`Fetching farm data for ${lowerCaseAddresses.length} addresses`)
  // Split it into chunks to avoid gateway timeout
  const groupsOf30 = chunk(lowerCaseAddresses, 30)
  const blockWeekAgo = await get7dBlock()

  let allAprs: AprMap = {}
  // eslint-disable-next-line no-restricted-syntax
  for (const group of groupsOf30) {
    // eslint-disable-next-line no-await-in-loop
    const aprs = await getChunkApr(group, blockWeekAgo)
    allAprs = { ...allAprs, ...aprs }
  }
  const aprsCount = Object.keys(allAprs).length
  if (aprsCount !== lowerCaseAddresses.length) {
    throw new Error(
      `Amount of LP APR results doesn't match amount of active farms (${aprsCount} out of ${lowerCaseAddresses.length}`,
    )
  }

  fs.writeFile(`src/config/constants/lpAprs.json`, JSON.stringify(allAprs, null, 2), (err) => {
    if (err) throw err
    console.info(` ✅ - lpAprs.json has been updated!`)
  })
}

fetchAndUpdateLPsAPR()
