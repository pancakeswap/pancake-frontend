/* eslint-disable no-param-reassign */
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { useDeltaTimestamps } from 'utils/infoQueryHelpers'
import { useBlocksFromTimestamps } from 'hooks/useBlocksFromTimestamps'
import { PoolData } from 'state/pools/types'
import { getChangeForPeriod, getLpFeesAndApr, getPercentChange } from 'utils/infoData'

/**
 * Data for displaying pool tables (on multiple pages, used throughout the site)
 * Note: Don't try to refactor it to use variables, server throws error if blocks passed as undefined variable
 * only works if its hard-coded into query string
 */
export const POOL_AT_BLOCK = (block: number | null, pools: string[]) => {
  const blockString = block ? `block: {number: ${block}}` : ``
  const addressesString = `["${pools.join('","')}"]`
  return `pairs(
    where: { id_in: ${addressesString} }
    ${blockString}
    orderBy: trackedReserveBNB
    orderDirection: desc
  ) {
    id
    reserve0
    reserve1
    reserveUSD
    volumeUSD
    token0Price
    token1Price
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

export const POOLS_BULK = (block24h: number, block48h: number, block7d: number, block14d: number, pools: string[]) => {
  return gql`
    query pools {
      now: ${POOL_AT_BLOCK(null, pools)}
      oneDayAgo: ${POOL_AT_BLOCK(block24h, pools)}
      twoDaysAgo: ${POOL_AT_BLOCK(block48h, pools)}
      oneWeekAgo: ${POOL_AT_BLOCK(block7d, pools)}
      twoWeeksAgo: ${POOL_AT_BLOCK(block14d, pools)}
    }
  `
}

interface PoolFields {
  id: string
  reserve0: string
  reserve1: string
  reserveUSD: string
  volumeUSD: string
  token0Price: string
  token1Price: string
  token0: {
    id: string
    symbol: string
    name: string
  }
  token1: {
    id: string
    symbol: string
    name: string
  }
}

interface FormattedPoolFields
  extends Omit<PoolFields, 'volumeUSD' | 'reserveUSD' | 'reserve0' | 'reserve1' | 'token0Price' | 'token1Price'> {
  volumeUSD: number
  reserveUSD: number
  reserve0: number
  reserve1: number
  token0Price: number
  token1Price: number
}

interface PoolsQueryResponse {
  now: PoolFields[]
  oneDayAgo: PoolFields[]
  twoDaysAgo: PoolFields[]
  oneWeekAgo: PoolFields[]
  twoWeeksAgo: PoolFields[]
}

// Transforms pools into "0xADDRESS: { ...PoolFields }" format and cast strigns to numbers
const parsePoolData = (pairs?: PoolFields[]) => {
  if (!pairs) {
    return {}
  }
  return pairs.reduce((accum: { [address: string]: FormattedPoolFields }, poolData) => {
    const { volumeUSD, reserveUSD, reserve0, reserve1, token0Price, token1Price } = poolData
    accum[poolData.id] = {
      ...poolData,
      volumeUSD: parseFloat(volumeUSD),
      reserveUSD: parseFloat(reserveUSD),
      reserve0: parseFloat(reserve0),
      reserve1: parseFloat(reserve1),
      token0Price: parseFloat(token0Price),
      token1Price: parseFloat(token1Price),
    }
    return accum
  }, {})
}

/**
 * Fetch top pools by liquidity
 */
export const usePoolDatas = (
  poolAddresses: string[],
): {
  loading: boolean
  error: boolean
  data?: {
    [address: string]: PoolData
  }
} => {
  const [t24h, t48h, t7d, t14d] = useDeltaTimestamps()
  const { blocks, error: blockError } = useBlocksFromTimestamps([t24h, t48h, t7d, t14d])
  const [block24h, block48h, block7d, block14d] = blocks ?? []

  // Note - it is very important to NOT use cache here
  // Apollo tries to do some optimizations under the hood so data from query that comes first
  // gets reused in the results for subsequent queries.
  // Moreover blocks are constantly changing so there is no sense to use cache here at all
  const { loading, error, data } = useQuery<PoolsQueryResponse>(
    POOLS_BULK(block24h?.number, block48h?.number, block7d?.number, block14d?.number, poolAddresses),
    {
      fetchPolicy: 'no-cache',
      skip: poolAddresses.length === 0 || !block24h || !block48h || !block7d || !block14d,
    },
  )

  const anyError = Boolean(error || blockError)

  // return early if not all data yet
  if (anyError || loading) {
    return {
      loading,
      error: anyError,
      data: undefined,
    }
  }

  const formattedPoolData = parsePoolData(data?.now)
  const formattedPoolData24h = parsePoolData(data?.oneDayAgo)
  const formattedPoolData48h = parsePoolData(data?.twoDaysAgo)
  const formattedPoolData7d = parsePoolData(data?.oneWeekAgo)
  const formattedPoolData14d = parsePoolData(data?.twoWeeksAgo)

  // Calculate data and format
  const formatted = poolAddresses.reduce((accum: { [address: string]: PoolData }, address) => {
    // Undefined data is possible if pool is brand new and didn't exist one day ago or week ago.
    const current: FormattedPoolFields | undefined = formattedPoolData[address]
    const oneDay: FormattedPoolFields | undefined = formattedPoolData24h[address]
    const twoDays: FormattedPoolFields | undefined = formattedPoolData48h[address]
    const week: FormattedPoolFields | undefined = formattedPoolData7d[address]
    const twoWeeks: FormattedPoolFields | undefined = formattedPoolData14d[address]

    const [volumeUSD, volumeUSDChange] = getChangeForPeriod(current?.volumeUSD, oneDay?.volumeUSD, twoDays?.volumeUSD)
    const [volumeUSDWeek, volumeUSDChangeWeek] = getChangeForPeriod(
      current?.volumeUSD,
      week?.volumeUSD,
      twoWeeks?.volumeUSD,
    )

    const tvlUSD = current ? current.reserveUSD : 0

    const tvlUSDChange = getPercentChange(current?.reserveUSD, oneDay?.reserveUSD)

    const tvlToken0 = current ? current.reserve0 : 0
    const tvlToken1 = current ? current.reserve1 : 0

    const { totalFees24h, totalFees7d, lpFees24h, lpFees7d, lpApr7d } = getLpFeesAndApr(
      volumeUSD,
      volumeUSDWeek,
      tvlUSD,
    )

    if (current) {
      accum[address] = {
        address,
        token0: {
          address: current.token0.id,
          name: current.token0.name,
          symbol: current.token0.symbol,
        },
        token1: {
          address: current.token1.id,
          name: current.token1.name,
          symbol: current.token1.symbol,
        },
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
        tvlUSD,
        tvlUSDChange,
        tvlToken0,
        tvlToken1,
      }
    }

    return accum
  }, {})

  return {
    loading,
    error: anyError,
    data: formatted,
  }
}
