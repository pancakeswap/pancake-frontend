/* eslint-disable no-param-reassign */
import { gql } from 'graphql-request'
import { subgraphTokenSymbol } from 'state/info/constant'
import { Block, PoolData } from 'state/info/types'
import { getChangeForPeriod } from 'utils/getChangeForPeriod'
import { getLpFeesAndApr } from 'utils/getLpFeesAndApr'
import { getAmountChange, getPercentChange } from 'views/Info/utils/infoDataHelpers'

import { safeGetAddress } from 'utils'
import {
  MultiChainName,
  STABLESWAP_SUBGRAPHS_START_BLOCK,
  checkIsStableSwap,
  getMultiChainQueryEndPointWithStableSwap,
} from '../../constant'
import { fetchTopPoolAddresses } from './topPools'

interface PoolFields {
  id: string
  reserve0: string
  reserve1: string
  reserveUSD: string
  volumeUSD: string
  volumeOutUSD?: string
  token0Price: string
  token1Price: string
  timestamp: number
  token0?: {
    id: string
    symbol: string
    name: string
  }
  token1?: {
    id: string
    symbol: string
    name: string
  }
}

export interface FormattedPoolFields
  extends Omit<
    PoolFields,
    'volumeUSD' | 'reserveUSD' | 'reserve0' | 'reserve1' | 'token0Price' | 'token1Price' | 'volumeOutUSD'
  > {
  volumeUSD: number
  reserveUSD: number
  reserve0: number
  reserve1: number
  token0Price: number
  token1Price: number
  volumeOutUSD?: number
}

interface PoolsQueryResponse {
  now: PoolFields[]
  oneDayAgo: PoolFields[]
  twoDaysAgo: PoolFields[]
  oneWeekAgo: PoolFields[]
  twoWeeksAgo: PoolFields[]
}

/**
 * Data for displaying pool tables (on multiple pages, used throughout the site)
 * Note: Don't try to refactor it to use variables, server throws error if blocks passed as undefined variable
 * only works if its hard-coded into query string
 */
const POOL_AT_BLOCK = (chainName: MultiChainName, block: number | null, pools: string[]) => {
  const blockString = block ? `block: {number: ${block}}` : ``
  const addressesString = `["${pools.join('","')}"]`
  const volumeOutUSDString = checkIsStableSwap() ? 'volumeOutUSD' : ''

  return `pairs(
    where: { id_in: ${addressesString} }
    ${blockString}
    orderBy: trackedReserveETH
    orderDirection: desc
  ) {
    id
    reserve0
    reserve1
    reserveUSD
    volumeUSD
    ${volumeOutUSDString}
    token0Price
    token1Price
    timestamp
    token0 {
      id
      symbol
      name
    }
    token1 {
      id
      symbol
      name
    }
  }`
}

export const fetchPoolData = async (
  block24h: number,
  block48h: number,
  block7d: number,
  block14d: number,
  poolAddresses: string[],
  chainName: MultiChainName = 'BSC',
) => {
  const isStableSwap = checkIsStableSwap()
  const startBlock = isStableSwap ? STABLESWAP_SUBGRAPHS_START_BLOCK[chainName] : undefined
  try {
    const query = gql`
      query pools {
        now: ${POOL_AT_BLOCK(chainName, null, poolAddresses)}
        oneDayAgo: ${POOL_AT_BLOCK(chainName, block24h, poolAddresses)}
        ${
          ((Boolean(startBlock) && startBlock <= block48h) || !startBlock) && block48h > 0
            ? `twoDaysAgo: ${POOL_AT_BLOCK(chainName, block48h, poolAddresses)}`
            : ''
        }
        ${
          ((Boolean(startBlock) && startBlock <= block7d) || !startBlock) && block7d > 0
            ? `oneWeekAgo: ${POOL_AT_BLOCK(chainName, block7d, poolAddresses)}`
            : ''
        }
        ${
          ((Boolean(startBlock) && startBlock <= block14d) || !startBlock) && block14d > 0
            ? `twoWeeksAgo: ${POOL_AT_BLOCK(chainName, block14d, poolAddresses)}`
            : ''
        }
      }
    `
    const data = await getMultiChainQueryEndPointWithStableSwap(chainName).request<PoolsQueryResponse>(query)
    return { data, error: false }
  } catch (error) {
    console.error('Failed to fetch pool data', error)
    return { error: true }
  }
}

// Transforms pools into "0xADDRESS: { ...PoolFields }" format and cast strings to numbers
export const parsePoolData = (pairs?: PoolFields[]) => {
  if (!pairs) {
    return {}
  }
  return pairs.reduce((accum: { [address: string]: FormattedPoolFields }, poolData) => {
    const { volumeUSD, reserveUSD, reserve0, reserve1, token0Price, token1Price, volumeOutUSD } = poolData
    accum[poolData.id.toLowerCase()] = {
      ...poolData,
      volumeUSD: parseFloat(volumeUSD),
      volumeOutUSD: volumeOutUSD ? parseFloat(volumeOutUSD) : 0,
      reserveUSD: parseFloat(reserveUSD),
      reserve0: parseFloat(reserve0),
      reserve1: parseFloat(reserve1),
      token0Price: parseFloat(token0Price),
      token1Price: parseFloat(token1Price),
    }
    return accum
  }, {})
}

export const fetchAllPoolDataWithAddress = async (
  blocks: Block[],
  chainName: MultiChainName,
  poolAddresses: string[],
) => {
  console.log('blocks', blocks)
  const [block24h, block48h, block7d, block14d] = blocks ?? []
  const { data } = await fetchPoolData(
    block24h?.number ?? 0,
    block48h?.number ?? 0,
    block7d?.number ?? 0,
    block14d?.number ?? 0,
    poolAddresses,
    chainName,
  )

  const formattedPoolData = parsePoolData(data?.now)
  const formattedPoolData24h = parsePoolData(data?.oneDayAgo)
  const formattedPoolData48h = parsePoolData(data?.twoDaysAgo)
  const formattedPoolData7d = parsePoolData(data?.oneWeekAgo)
  const formattedPoolData14d = parsePoolData(data?.twoWeeksAgo)

  // Calculate data and format
  const formatted = poolAddresses.reduce((accum: { [address: string]: { data: PoolData } }, address) => {
    // Undefined data is possible if pool is brand new and didn't exist one day ago or week ago.
    const current: FormattedPoolFields | undefined = formattedPoolData[address]
    const oneDay: FormattedPoolFields | undefined = formattedPoolData24h[address]
    const twoDays: FormattedPoolFields | undefined = formattedPoolData48h[address]
    const week: FormattedPoolFields | undefined = formattedPoolData7d[address]
    const twoWeeks: FormattedPoolFields | undefined = formattedPoolData14d[address]

    const [volumeUSD, volumeUSDChange] = getChangeForPeriod(current?.volumeUSD, oneDay?.volumeUSD, twoDays?.volumeUSD)
    const volumeOutUSD = current?.volumeOutUSD && getAmountChange(current?.volumeOutUSD, oneDay?.volumeOutUSD)
    const volumeOutUSDWeek = current?.volumeOutUSD && getAmountChange(current?.volumeOutUSD, week?.volumeOutUSD)
    const [volumeUSDWeek, volumeUSDChangeWeek] = getChangeForPeriod(
      current?.volumeUSD,
      week?.volumeUSD,
      twoWeeks?.volumeUSD,
    )

    const liquidityUSD = current ? current.reserveUSD : 0

    const liquidityUSDChange = getPercentChange(current?.reserveUSD, oneDay?.reserveUSD)

    const liquidityToken0 = current ? current.reserve0 : 0
    const liquidityToken1 = current ? current.reserve1 : 0
    const timestamp = current?.timestamp ?? 0

    const { totalFees24h, totalFees7d, lpFees24h, lpFees7d, lpApr7d } = getLpFeesAndApr(
      volumeUSD,
      volumeUSDWeek,
      liquidityUSD,
    )

    if (current) {
      const token0Address = safeGetAddress(current?.token0?.id)
      const token1Address = safeGetAddress(current?.token1?.id)
      accum[address] = {
        data: {
          address,
          token0: {
            address: current?.token0?.id ?? '',
            name: current?.token0?.name ?? '',
            symbol: !token0Address ? '' : subgraphTokenSymbol[token0Address] ?? current?.token0?.symbol ?? '',
          },
          token1: {
            address: current?.token1?.id ?? '',
            name: current?.token1?.name ?? '',
            symbol: !token1Address ? '' : subgraphTokenSymbol[token1Address] ?? current?.token1?.symbol ?? '',
          },
          timestamp,
          token0Price: current.token0Price,
          token1Price: current.token1Price,
          volumeUSD,
          volumeUSDChange,
          volumeUSDWeek,
          volumeUSDChangeWeek,
          totalFees24h,
          totalFees7d,
          lpFees24h,
          lpFees7d,
          lpApr7d,
          liquidityUSD,
          liquidityUSDChange,
          liquidityToken0,
          liquidityToken1,
          volumeOutUSD,
          volumeOutUSDWeek,
        },
      }
    }

    return accum
  }, {})
  return formatted
}

export const fetchAllPoolData = async (blocks: Block[], chainName: MultiChainName) => {
  const poolAddresses = await fetchTopPoolAddresses(chainName)
  return fetchAllPoolDataWithAddress(blocks, chainName, poolAddresses)
}
