/* eslint-disable no-param-reassign */
import { useEffect, useState } from 'react'
import { request, gql } from 'graphql-request'
import { INFO_CLIENT } from 'config/constants/endpoints'
import { useDeltaTimestamps } from 'utils/infoQueryHelpers'
import { useBlocksFromTimestamps } from 'hooks/useBlocksFromTimestamps'
import { PoolData } from 'state/info/types'
import { getChangeForPeriod, getLpFeesAndApr, getPercentChange } from 'utils/infoData'

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

const fetchPoolData = async (
  block24h: number,
  block48h: number,
  block7d: number,
  block14d: number,
  poolAddresses: string[],
) => {
  try {
    const query = gql`
      query pools {
        now: ${POOL_AT_BLOCK(null, poolAddresses)}
        oneDayAgo: ${POOL_AT_BLOCK(block24h, poolAddresses)}
        twoDaysAgo: ${POOL_AT_BLOCK(block48h, poolAddresses)}
        oneWeekAgo: ${POOL_AT_BLOCK(block7d, poolAddresses)}
        twoWeeksAgo: ${POOL_AT_BLOCK(block14d, poolAddresses)}
      }
    `
    const data = await request<PoolsQueryResponse>(INFO_CLIENT, query)
    return { data, error: false }
  } catch (error) {
    console.error('Failed to fetch pool data', error)
    return { erro: true }
  }
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

interface PoolDatas {
  error: boolean
  data?: {
    [address: string]: PoolData
  }
}

/**
 * Fetch top pools by liquidity
 */
export const usePoolDatas = (poolAddresses: string[]): PoolDatas => {
  const [fetchState, setFetchState] = useState<PoolDatas>({ error: false })
  const [t24h, t48h, t7d, t14d] = useDeltaTimestamps()
  const { blocks, error: blockError } = useBlocksFromTimestamps([t24h, t48h, t7d, t14d])
  const [block24h, block48h, block7d, block14d] = blocks ?? []

  useEffect(() => {
    const fetch = async () => {
      const { error, data } = await fetchPoolData(
        block24h.number,
        block48h.number,
        block7d.number,
        block14d.number,
        poolAddresses,
      )
      if (error) {
        setFetchState({ error: true })
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

        const [volumeUSD, volumeUSDChange] = getChangeForPeriod(
          current?.volumeUSD,
          oneDay?.volumeUSD,
          twoDays?.volumeUSD,
        )
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
      setFetchState({ data: formatted, error: false })
    }

    const allBlocksAvailable = block24h?.number && block48h?.number && block7d?.number && block14d?.number
    if (poolAddresses.length > 0 && allBlocksAvailable && !blockError) {
      fetch()
    }
  }, [poolAddresses, block24h, block48h, block7d, block14d, blockError])

  return fetchState
}
