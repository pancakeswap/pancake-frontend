import { gql, GraphQLClient } from 'graphql-request'
import BigNumber from 'bignumber.js'
import { Block } from 'state/info/types'
import { components } from 'state/info/api/schema'
import { explorerApiClient } from 'state/info/api/client'
import { getPercentChange } from 'utils/infoDataHelpers'
import { get2DayChange } from '../../utils/data'
import { PoolData } from '../../types'

export const POOLS_BULK = (block: number | undefined, pools: string[]) => {
  let poolString = `[`
  pools.forEach((address) => {
    poolString = `${poolString}"${address}",`
  })
  poolString += ']'
  const queryString = `
    query pools {
      pools(where: {id_in: ${poolString}},
     ${block ? `block: {number: ${block}} ,` : ``}
     orderBy: totalValueLockedUSD, orderDirection: desc) {
        id
        feeTier
        liquidity
        sqrtPrice
        tick
        token0 {
            id
            symbol
            name
            decimals
            derivedETH
        }
        token1 {
            id
            symbol
            name
            decimals
            derivedETH
        }
        token0Price
        token1Price
        volumeUSD
        volumeToken0
        volumeToken1
        txCount
        totalValueLockedToken0
        totalValueLockedToken1
        totalValueLockedUSD
        feesUSD
        protocolFeesUSD
      }
      bundles(where: {id: "1"}) {
        ethPriceUSD
      }
    }
    `
  return gql`
    ${queryString}
  `
}

interface PoolFields {
  id: string
  feeTier: string
  liquidity: string
  sqrtPrice: string
  tick: string
  token0: {
    id: string
    symbol: string
    name: string
    decimals: string
    derivedETH: string
  }
  token1: {
    id: string
    symbol: string
    name: string
    decimals: string
    derivedETH: string
  }
  token0Price: string
  token1Price: string
  volumeUSD: string
  volumeToken0: string
  volumeToken1: string
  txCount: string
  totalValueLockedToken0: string
  totalValueLockedToken1: string
  totalValueLockedUSD: string
  feesUSD: string
  protocolFeesUSD: string
}

interface PoolDataResponse {
  pools: PoolFields[]
  bundles: {
    ethPriceUSD: string
  }[]
}

export async function fetchedPoolData(
  chainName: components['schemas']['ChainName'],
  poolAddress: string,
  signal: AbortSignal,
): Promise<{
  error: boolean
  data: PoolData | undefined
}> {
  try {
    const data = await explorerApiClient
      .GET('/cached/pools/v3/{chainName}/{address}', {
        signal,
        params: {
          path: {
            chainName,
            address: poolAddress,
          },
        },
      })
      .then((res) => res.data)

    if (!data) {
      return {
        error: false,
        data: undefined,
      }
    }

    const volumeUSD = data.volumeUSD24h ? parseFloat(data.volumeUSD24h) : 0

    const volumeOneWindowAgo =
      data.volumeUSD24h && data.volumeUSD48h ? parseFloat(data.volumeUSD48h) - parseFloat(data.volumeUSD24h) : undefined

    const volumeUSDChange = volumeUSD && volumeOneWindowAgo ? getPercentChange(volumeUSD, volumeOneWindowAgo) : 0

    const volumeUSDWeek = data.volumeUSD7d ? parseFloat(data.volumeUSD7d) : 0

    const tvlUSD = data.tvlUSD ? parseFloat(data.tvlUSD) : 0
    const tvlUSDChange = getPercentChange(
      data.tvlUSD ? parseFloat(data.tvlUSD) : undefined,
      data.tvlUSD24h ? parseFloat(data.tvlUSD24h) : undefined,
    )

    const feeUSD = parseFloat(data.feeUSD24h) ?? 0

    return {
      error: false,
      data: {
        address: data.id,
        feeTier: data.feeTier,
        liquidity: parseFloat(data.liquidity),
        sqrtPrice: parseFloat(data.sqrtPrice),
        tick: data.tick ?? 0,
        token0: {
          address: data.token0.id,
          name: data.token0.name,
          symbol: data.token0.symbol,
          decimals: data.token0.decimals,
          derivedETH: 0,
        },
        token1: {
          address: data.token1.id,
          name: data.token1.name,
          symbol: data.token1.symbol,
          decimals: data.token1.decimals,
          derivedETH: 0,
        },
        token0Price: parseFloat(data.token0Price),
        token1Price: parseFloat(data.token1Price),
        volumeUSD,
        volumeUSDChange,
        volumeUSDWeek,
        tvlUSD,
        tvlUSDChange,
        tvlToken0: parseFloat(data.tvlToken0),
        tvlToken1: parseFloat(data.tvlToken1),
        feeUSD,
      },
    }
  } catch (e) {
    return {
      error: true,
      data: undefined,
    }
  }
}

/**
 * Fetch top addresses by volume
 */
export async function fetchPoolDatas(
  dataClient: GraphQLClient,
  poolAddresses: string[],
  blocks?: Block[],
): Promise<{
  error: boolean
  data:
    | {
        [address: string]: PoolData
      }
    | undefined
}> {
  // get blocks from historic timestamps

  try {
    const [block24, block48, blockWeek] = blocks ?? []

    const data = await dataClient.request<PoolDataResponse>(POOLS_BULK(undefined, poolAddresses))

    const data24 = await dataClient.request<PoolDataResponse>(POOLS_BULK(block24?.number, poolAddresses))
    const data48 = await dataClient.request<PoolDataResponse>(POOLS_BULK(block48?.number, poolAddresses))
    const dataWeek = await dataClient.request<PoolDataResponse>(POOLS_BULK(blockWeek?.number, poolAddresses))

    // return early if not all data yet

    const ethPriceUSD = data?.bundles?.[0]?.ethPriceUSD ? parseFloat(data?.bundles?.[0]?.ethPriceUSD) : 0

    const parsed = data?.pools
      ? data.pools.reduce((accum: { [address: string]: PoolFields }, poolData) => {
          // eslint-disable-next-line no-param-reassign
          accum[poolData.id] = poolData
          return accum
        }, {})
      : {}
    const parsed24 = data24?.pools
      ? data24.pools.reduce((accum: { [address: string]: PoolFields }, poolData) => {
          // eslint-disable-next-line no-param-reassign
          accum[poolData.id] = poolData
          return accum
        }, {})
      : {}
    const parsed48 = data48?.pools
      ? data48.pools.reduce((accum: { [address: string]: PoolFields }, poolData) => {
          // eslint-disable-next-line no-param-reassign
          accum[poolData.id] = poolData
          return accum
        }, {})
      : {}
    const parsedWeek = dataWeek?.pools
      ? dataWeek.pools.reduce((accum: { [address: string]: PoolFields }, poolData) => {
          // eslint-disable-next-line no-param-reassign
          accum[poolData.id] = poolData
          return accum
        }, {})
      : {}

    // format data and calculate daily changes
    const formatted = poolAddresses.reduce((accum: { [address: string]: PoolData }, address) => {
      const current: PoolFields | undefined = parsed[address]
      const oneDay: PoolFields | undefined = parsed24[address]
      const twoDay: PoolFields | undefined = parsed48[address]
      const week: PoolFields | undefined = parsedWeek[address]

      const [volumeUSD, volumeUSDChange] =
        current && oneDay && twoDay
          ? get2DayChange(current.volumeUSD, oneDay.volumeUSD, twoDay.volumeUSD)
          : current
          ? [parseFloat(current.volumeUSD), 0]
          : [0, 0]

      const volumeUSDWeek =
        current && week
          ? parseFloat(current.volumeUSD) - parseFloat(week.volumeUSD)
          : current
          ? parseFloat(current.volumeUSD)
          : 0
      const feeUSD =
        current && oneDay
          ? new BigNumber(current?.feesUSD)
              .minus(current?.protocolFeesUSD)
              .minus(new BigNumber(oneDay?.feesUSD).minus(oneDay?.protocolFeesUSD))
          : new BigNumber(current?.feesUSD).minus(current?.protocolFeesUSD)
      const tvlToken0 = current ? parseFloat(current.totalValueLockedToken0) : 0
      const tvlToken1 = current ? parseFloat(current.totalValueLockedToken1) : 0
      let tvlUSD = current ? parseFloat(current.totalValueLockedUSD) : 0

      const tvlUSDChange =
        current && oneDay
          ? ((parseFloat(current.totalValueLockedUSD) - parseFloat(oneDay.totalValueLockedUSD)) /
              parseFloat(oneDay.totalValueLockedUSD === '0' ? '1' : oneDay.totalValueLockedUSD)) *
            100
          : 0

      // Part of TVL fix
      const tvlUpdated = current
        ? tvlToken0 * parseFloat(current.token0.derivedETH) * ethPriceUSD +
          tvlToken1 * parseFloat(current.token1.derivedETH) * ethPriceUSD
        : undefined
      if (tvlUpdated) {
        tvlUSD = tvlUpdated
      }

      const feeTier = current ? parseInt(current.feeTier) : 0

      if (current) {
        // eslint-disable-next-line no-param-reassign
        accum[address] = {
          address,
          feeTier,
          liquidity: parseFloat(current.liquidity),
          sqrtPrice: parseFloat(current.sqrtPrice),
          tick: parseFloat(current.tick),
          token0: {
            address: current.token0.id,
            name: current.token0.name,
            symbol: current.token0.symbol,
            decimals: parseInt(current.token0.decimals),
            derivedETH: parseFloat(current.token0.derivedETH),
          },
          token1: {
            address: current.token1.id,
            name: current.token1.name,
            symbol: current.token1.symbol,
            decimals: parseInt(current.token1.decimals),
            derivedETH: parseFloat(current.token1.derivedETH),
          },
          token0Price: parseFloat(current.token0Price),
          token1Price: parseFloat(current.token1Price),
          volumeUSD,
          volumeUSDChange,
          volumeUSDWeek,
          tvlUSD,
          tvlUSDChange,
          tvlToken0,
          tvlToken1,
          feeUSD: feeUSD.toNumber(),
        }
      }

      return accum
    }, {})

    return {
      error: false,
      data: formatted,
    }
  } catch (e) {
    console.error(e)
    return { error: true, data: undefined }
  }
}
