import { gql, GraphQLClient } from 'graphql-request'
import BigNumber from 'bignumber.js'
import { Block } from 'state/info/types'
import { PoolData } from '../../types'
import { get2DayChange } from '../../utils/data'

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

/**
 * Fetch top addresses by volume
 */
export async function fetchPoolDatas(
  dataClient: GraphQLClient,
  poolAddresses: string[],
  blocks: Block[],
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
      // Hotifx: Subtract fees from TVL to correct data while subgraph is fixed.
      /**
       * Note: see issue desribed here https://github.com/Uniswap/v3-subgraph/issues/74
       * During subgraph deploy switch this month we lost logic to fix this accounting.
       * Grafted sync pending fix now.
       * @chef-jojo: should be fixed on our version, but leaving this in for now
       */
      const feePercent = current ? parseFloat(current.feeTier) / 10000 / 100 : 0
      const tvlAdjust0 = current?.volumeToken0 ? (parseFloat(current.volumeToken0) * feePercent) / 2 : 0
      const tvlAdjust1 = current?.volumeToken1 ? (parseFloat(current.volumeToken1) * feePercent) / 2 : 0
      const tvlToken0 = current ? parseFloat(current.totalValueLockedToken0) - tvlAdjust0 : 0
      const tvlToken1 = current ? parseFloat(current.totalValueLockedToken1) - tvlAdjust1 : 0
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
