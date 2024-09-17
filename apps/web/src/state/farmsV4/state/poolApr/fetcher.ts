import { ChainId } from '@pancakeswap/chains'
import { supportedChainIdV4 } from '@pancakeswap/farms'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { masterChefV3ABI, pancakeV3PoolABI } from '@pancakeswap/v3-sdk'
import { create, windowedFiniteBatchScheduler } from '@yornaath/batshit'
import BigNumber from 'bignumber.js'
import { SECONDS_PER_YEAR } from 'config'
import { v2BCakeWrapperABI } from 'config/abi/v2BCakeWrapper'
import dayjs from 'dayjs'
import groupBy from 'lodash/groupBy'
import set from 'lodash/set'
import { chainIdToExplorerInfoChainName, explorerApiClient } from 'state/info/api/client'
import { safeGetAddress } from 'utils'
import { usdPriceBatcher } from 'utils/batcher'
import { getMasterChefV3Contract, getV2SSBCakeWrapperContract } from 'utils/contractHelpers'
import { publicClient } from 'utils/wagmi'
import { erc20Abi } from 'viem'
import { PoolInfo, StablePoolInfo, V2PoolInfo, V3PoolInfo } from '../type'
import { CakeApr, MerklApr } from './atom'

export const getCakeApr = (pool: PoolInfo, cakePrice: BigNumber): Promise<CakeApr> => {
  switch (pool.protocol) {
    case 'v3':
      return v3PoolCakeAprBatcher.fetch({ pool, cakePrice })
    case 'v2':
    case 'stable':
      return v2PoolCakeAprBatcher.fetch({ pool, cakePrice })
    default:
      return Promise.resolve({
        [`${pool.chainId}:${pool.lpAddress}`]: {
          value: '0' as const,
        },
      })
  }
}

// @todo @ChefJerry should directly fetch from poolInfo api, BE need update
export const getLpApr = async (pool: PoolInfo, signal?: AbortSignal): Promise<number> => {
  const { protocol } = pool
  const chainName = chainIdToExplorerInfoChainName[pool.chainId]

  const resp = await explorerApiClient.GET(
    protocol === 'v4bin'
      ? `/cached/pools/apr/v4/{chainName}/{id}`
      : `/cached/pools/apr/${protocol}/{chainName}/{address}`,
    {
      signal,
      params: {
        path: {
          address: pool.lpAddress,
          chainName,
        },
      },
    },
  )
  if (!resp.data) {
    return 0
  }

  return resp.data.apr7d ? parseFloat(resp.data.apr7d) : 0
}

const masterChefV3CacheMap = new Map<
  number,
  {
    totalAllocPoint: bigint
    latestPeriodCakePerSecond: bigint
  }
>()

export const getV3PoolCakeApr = async (pool: V3PoolInfo, cakePrice: BigNumber): Promise<CakeApr[keyof CakeApr]> => {
  const { tvlUsd } = pool
  const client = publicClient({ chainId: pool.chainId })
  const masterChefV3 = getMasterChefV3Contract(undefined, pool.chainId)

  if (!tvlUsd || !client || !masterChefV3 || !pool.pid) {
    return {
      value: '0',
    }
  }

  const [totalAllocPoint, latestPeriodCakePerSecond, poolInfo] = await Promise.all([
    masterChefV3CacheMap.get(pool.chainId)?.totalAllocPoint ?? masterChefV3.read.totalAllocPoint(),
    masterChefV3CacheMap.get(pool.chainId)?.latestPeriodCakePerSecond ?? masterChefV3.read.latestPeriodCakePerSecond(),
    masterChefV3.read.poolInfo([BigInt(pool.pid)]),
  ])

  if (!masterChefV3CacheMap.has(pool.chainId)) {
    masterChefV3CacheMap.set(pool.chainId, {
      ...(masterChefV3CacheMap.get(pool.chainId) ?? {}),
      totalAllocPoint,
      latestPeriodCakePerSecond,
    })
  }

  const cakePerYear = new BigNumber(SECONDS_PER_YEAR)
    .times(latestPeriodCakePerSecond.toString())
    .dividedBy(1e18)
    .dividedBy(1e12)
  const cakePerYearUsd = cakePrice.times(cakePerYear.toString())
  const [allocPoint, , , , , totalLiquidity, totalBoostLiquidity] = poolInfo
  const poolWeight = new BigNumber(allocPoint.toString()).dividedBy(totalAllocPoint.toString())
  const liquidityBooster = new BigNumber(totalBoostLiquidity.toString()).dividedBy(totalLiquidity.toString())

  const baseApr = cakePerYearUsd.times(poolWeight).dividedBy(liquidityBooster.times(pool.tvlUsd ?? 1))
  const multiplier = DEFAULT_V3_CAKE_APR_BOOST_MULTIPLIER[pool.chainId]

  return {
    value: baseApr.toString() as `${number}`,
    boost: multiplier ? (baseApr.times(multiplier).toString() as `${number}`) : undefined,
    cakePerYear,
    poolWeight,
  }
}

const calcV3PoolApr = ({
  pool,
  cakePrice,
  totalAllocPoint,
  latestPeriodCakePerSecond,
  poolInfo,
  liquidity,
}: {
  pool: V3PoolInfo
  cakePrice: BigNumber
  totalAllocPoint: bigint
  latestPeriodCakePerSecond: bigint
  poolInfo: readonly [bigint, `0x${string}`, `0x${string}`, `0x${string}`, number, bigint, bigint]
  liquidity: bigint
}) => {
  const cakePerYear = new BigNumber(SECONDS_PER_YEAR)
    .times(latestPeriodCakePerSecond.toString())
    .dividedBy(1e18)
    .dividedBy(1e12)
  const cakePerYearUsd = cakePrice.times(cakePerYear.toString())
  const [allocPoint, , , , , totalLiquidity, totalBoostLiquidity] = poolInfo
  const poolWeight = new BigNumber(allocPoint.toString()).dividedBy(totalAllocPoint.toString())
  const liquidityBooster =
    Number(totalLiquidity) === 0
      ? BIG_ZERO
      : new BigNumber(totalBoostLiquidity.toString()).dividedBy(totalLiquidity.toString())
  // @fixme @ChefJerry use batched https://farms-api.pancakeswap.com/v3/{chainId}/liquidity/{lp}
  // to calculate active pool TVL
  const poolTvlUsd = new BigNumber(pool.tvlUsd ?? 0)

  const baseApr =
    liquidityBooster.isZero() || poolTvlUsd.isZero()
      ? BIG_ZERO
      : cakePerYearUsd.times(poolWeight).dividedBy(liquidityBooster.times(poolTvlUsd ?? 1))

  const multiplier = DEFAULT_V3_CAKE_APR_BOOST_MULTIPLIER[pool.chainId]

  return {
    value: liquidity > 0n ? (baseApr.toString() as `${number}`) : '0',
    boost: multiplier && liquidity > 0n ? (baseApr.times(multiplier).toString() as `${number}`) : undefined,
    cakePerYear,
    poolWeight,
  }
}

export const DEFAULT_V2_CAKE_APR_BOOST_MULTIPLIER = {
  [ChainId.ETHEREUM]: 2.5,
  [ChainId.BSC]: 2.5,
  [ChainId.ZKSYNC]: 2.5,
  [ChainId.ARBITRUM_ONE]: 2.5,
}
export const DEFAULT_V3_CAKE_APR_BOOST_MULTIPLIER = {
  [ChainId.ETHEREUM]: 2,
  [ChainId.BSC]: 2,
  [ChainId.ZKSYNC]: 2,
  [ChainId.ARBITRUM_ONE]: 2,
}
export const getV2PoolCakeApr = async (
  pool: V2PoolInfo | StablePoolInfo,
  cakePrice: BigNumber,
): Promise<{ value: `${number}`; boost?: `${number}` }> => {
  const { bCakeWrapperAddress } = pool
  const client = publicClient({ chainId: pool.chainId })
  if (!bCakeWrapperAddress || !client) {
    return {
      value: '0',
      boost: '0',
    }
  }

  const bCakeWrapperContract = getV2SSBCakeWrapperContract(bCakeWrapperAddress, undefined, pool.chainId)
  const cakePerSecond = await bCakeWrapperContract.read.rewardPerSecond()
  const cakeOneYearUsd = cakePrice.times((cakePerSecond * BigInt(SECONDS_PER_YEAR)).toString()).dividedBy(1e18)

  const baseApr = cakeOneYearUsd.dividedBy(pool.tvlUsd ?? 1)
  const multiplier = DEFAULT_V2_CAKE_APR_BOOST_MULTIPLIER[pool.chainId]

  return {
    value: baseApr.toString() as `${number}`,
    boost: multiplier ? (baseApr.times(multiplier).toString() as `${number}`) : undefined,
  }
}

export const getMerklApr = async (result: any, chainId: number) => {
  try {
    if (!result[chainId] || !result[chainId].pools) return {}
    return Object.keys(result[chainId].pools).reduce((acc, poolId) => {
      const key = `${chainId}:${safeGetAddress(poolId)}`
      if (!result[chainId].pools[poolId].aprs || !Object.keys(result[chainId].pools[poolId].aprs).length) return acc

      const apr = result[chainId].pools[poolId].aprs?.['Average APR (rewards / pool TVL)'] ?? '0'
      // eslint-disable-next-line no-param-reassign
      acc[key] = apr / 100
      return acc
    }, {} as MerklApr)
  } catch (error) {
    console.error('Failed to process merkl apr', error)
    return {}
  }
}

export const getAllNetworkMerklApr = async (signal?: AbortSignal) => {
  const resp = await fetch(`https://api.angle.money/v2/merkl?AMMs=pancakeswapv3`, { signal })
  if (resp.ok) {
    const result = await resp.json()
    const aprs = await Promise.all(supportedChainIdV4.map((chainId) => getMerklApr(result, chainId)))
    return aprs.reduce((acc, apr) => Object.assign(acc, apr), {})
  }
  throw resp
}

const getV3PoolsCakeAprByChainId = async (pools: V3PoolInfo[], chainId: number, cakePrice: BigNumber) => {
  const masterChefV3 = getMasterChefV3Contract(undefined, chainId)
  const client = publicClient({ chainId })

  if (!masterChefV3 || !client) return {}

  const validPools = pools.filter((pool) => {
    return pool.pid && pool.chainId === chainId
  })

  if (!validPools?.length) return {}

  const [totalAllocPoint, latestPeriodCakePerSecond] = await Promise.all([
    masterChefV3CacheMap.get(chainId)?.totalAllocPoint ?? masterChefV3.read.totalAllocPoint(),
    masterChefV3CacheMap.get(chainId)?.latestPeriodCakePerSecond ?? masterChefV3.read.latestPeriodCakePerSecond(),
  ])

  masterChefV3CacheMap.set(chainId, {
    ...(masterChefV3CacheMap.get(chainId) ?? {}),
    totalAllocPoint,
    latestPeriodCakePerSecond,
  })

  const poolInfoCalls = validPools.map(
    (pool) =>
      ({
        address: masterChefV3.address,
        functionName: 'poolInfo',
        abi: masterChefV3ABI,
        args: [BigInt(pool.pid!)],
      } as const),
  )

  const liquidityCalls = validPools.map((pool) => {
    return {
      address: pool.lpAddress,
      functionName: 'liquidity',
      abi: pancakeV3PoolABI,
    } as const
  })

  const [poolInfos, liquidities] = await Promise.all([
    client.multicall({
      contracts: poolInfoCalls,
      allowFailure: false,
    }),
    client.multicall({
      contracts: liquidityCalls,
      allowFailure: false,
    }),
  ])

  return validPools.reduce((acc, pool, index) => {
    const poolInfo = poolInfos[index]
    if (!poolInfo) return acc
    const key = `${chainId}:${safeGetAddress(pool.lpAddress)}`
    const liquidity = liquidities[index]
    set(
      acc,
      key,
      calcV3PoolApr({
        pool,
        cakePrice,
        totalAllocPoint,
        latestPeriodCakePerSecond,
        poolInfo,
        liquidity,
      }),
    )
    return acc
  }, {} as CakeApr)
}

const getV3PoolsCakeApr = async (queries: { pool: V3PoolInfo; cakePrice: BigNumber }[]): Promise<CakeApr> => {
  const pools = queries.map((query) => query.pool)
  const cakePrice = queries[0]?.cakePrice
  const poolsByChainId = groupBy(pools, 'chainId')
  const aprs = await Promise.all(
    Object.keys(poolsByChainId).map((chainId) =>
      getV3PoolsCakeAprByChainId(poolsByChainId[chainId], Number(chainId), cakePrice),
    ),
  )
  return aprs.reduce((acc, apr) => Object.assign(acc, apr), {})
}

const v3PoolCakeAprBatcher = create<CakeApr, { pool: V3PoolInfo; cakePrice: BigNumber }, CakeApr>({
  fetcher: getV3PoolsCakeApr,
  resolver: (items, query) => {
    const { pool } = query
    const key = `${pool.chainId}:${pool.lpAddress}`
    return { [key]: items[key] }
  },
  scheduler: windowedFiniteBatchScheduler({
    windowMs: 60,
    maxBatchSize: 100,
  }),
})

const calcV2PoolApr = ({
  pool,
  cakePrice,
  cakePerSecond,
  totalBoostShare,
  totalSupply,
  token0PriceUsd,
  token1PriceUsd,
  token0Reserve,
  token1Reserve,
}: {
  pool: V2PoolInfo | StablePoolInfo
  cakePrice: BigNumber
  cakePerSecond: bigint
  totalBoostShare: bigint
  totalSupply: bigint
  token0PriceUsd: number
  token1PriceUsd: number
  token0Reserve: bigint
  token1Reserve: bigint
}) => {
  if (cakePerSecond === 0n) {
    return {
      value: '0',
      cakePerYear: new BigNumber(0),
    }
  }
  const cakePerYear = new BigNumber(SECONDS_PER_YEAR).times(cakePerSecond.toString()).dividedBy(1e18)
  const cakeOneYearUsd = cakePrice.times(cakePerYear.toString())
  const poolTvlUsd = new BigNumber(
    new BigNumber(token0Reserve.toString()).times(token0PriceUsd).div(10 ** pool.token0.decimals),
  ).plus(new BigNumber(token1Reserve.toString()).times(token1PriceUsd).div(10 ** pool.token1.decimals))

  const usdPerShare = poolTvlUsd.div(totalSupply.toString() ?? 1)

  const farmingTVLUsd = usdPerShare.times(totalBoostShare.toString() ?? 0)

  const baseApr = cakeOneYearUsd.dividedBy((farmingTVLUsd ?? 1).toString())
  const multiplier = DEFAULT_V2_CAKE_APR_BOOST_MULTIPLIER[pool.chainId]

  return {
    value: baseApr.toString() as `${number}`,
    boost: multiplier && baseApr.gt(0) ? (baseApr.times(multiplier).toString() as `${number}`) : undefined,
    cakePerYear,
    userTvlUsd: farmingTVLUsd,
    totalSupply,
  }
}

const getV2PoolsCakeAprByChainId = async (
  pools: Array<V2PoolInfo | StablePoolInfo>,
  chainId: number,
  cakePrice: BigNumber,
) => {
  const client = publicClient({ chainId })
  const validPools = pools.filter((p) => p.chainId === chainId && p.bCakeWrapperAddress)

  if (!validPools?.length) return {}

  const rewardPerSecondCalls = validPools.map((pool) => {
    return {
      address: pool.bCakeWrapperAddress!,
      functionName: 'rewardPerSecond',
      abi: v2BCakeWrapperABI,
    } as const
  })

  const totalSupplyCalls = validPools.map((pool) => {
    return {
      address: pool.lpAddress,
      functionName: 'totalSupply',
      abi: erc20Abi,
    } as const
  })

  const reserve0Calls = validPools.map((pool) => {
    return {
      address: pool.token0.wrapped.address,
      functionName: 'balanceOf',
      abi: erc20Abi,
      args: [pool.stableSwapAddress ?? pool.lpAddress],
    } as const
  })
  const reserve1Calls = validPools.map((pool) => {
    return {
      address: pool.token1.wrapped.address,
      functionName: 'balanceOf',
      abi: erc20Abi,
      args: [pool.stableSwapAddress ?? pool.lpAddress],
    } as const
  })

  const totalBoostedShareCalls = validPools.map((pool) => {
    return {
      address: pool.bCakeWrapperAddress!,
      functionName: 'totalBoostedShare',
      abi: v2BCakeWrapperABI,
    } as const
  })

  const endTimestampCalls = validPools.map((pool) => {
    return {
      address: pool.bCakeWrapperAddress!,
      functionName: 'endTimestamp',
      abi: v2BCakeWrapperABI,
    } as const
  })

  const priceCalls = validPools.map(async (pool) => {
    return Promise.all([usdPriceBatcher.fetch(pool.token0), usdPriceBatcher.fetch(pool.token1)])
  })

  const [rewardPerSecondResults, totalBoostedShareResults, totalSupplies, reserve0s, reserve1s, endTimestamps, prices] =
    await Promise.all([
      client.multicall({
        contracts: rewardPerSecondCalls,
        allowFailure: false,
      }),
      client.multicall({
        contracts: totalBoostedShareCalls,
        allowFailure: false,
      }),
      client.multicall({
        contracts: totalSupplyCalls,
        allowFailure: false,
      }),
      client.multicall({
        contracts: reserve0Calls,
        allowFailure: false,
      }),
      client.multicall({
        contracts: reserve1Calls,
        allowFailure: false,
      }),
      client.multicall({
        contracts: endTimestampCalls,
        allowFailure: false,
      }),
      Promise.all(priceCalls),
    ])

  return validPools.reduce((acc, pool, index) => {
    const rewardPerSecond = rewardPerSecondResults[index]
    const totalBoostShare = totalBoostedShareResults[index]
    const endTimestamp = endTimestamps[index]
    const expired = endTimestamp && Number(endTimestamp) < dayjs().unix()
    const [token0PriceUsd, token1PriceUsd] = prices[index]
    const token0Reserve = reserve0s[index]
    const token1Reserve = reserve1s[index]
    if (!rewardPerSecond || expired) return acc
    const key = `${chainId}:${safeGetAddress(pool.lpAddress)}`
    set(
      acc,
      key,
      calcV2PoolApr({
        pool: pool as V2PoolInfo | StablePoolInfo,
        cakePrice,
        cakePerSecond: rewardPerSecond,
        totalBoostShare,
        totalSupply: totalSupplies[index],
        token0PriceUsd,
        token1PriceUsd,
        token0Reserve,
        token1Reserve,
      }),
    )
    return acc
  }, {} as CakeApr)
}
const getV2PoolsCakeApr = async (
  queries: { pool: V2PoolInfo | StablePoolInfo; cakePrice: BigNumber }[],
): Promise<CakeApr> => {
  const pools = queries.map((query) => query.pool)
  const cakePrice = queries[0]?.cakePrice
  const poolsByChainId = groupBy(pools, 'chainId')
  const aprs = await Promise.all(
    Object.keys(poolsByChainId).map((chainId) =>
      getV2PoolsCakeAprByChainId(poolsByChainId[chainId], Number(chainId), cakePrice),
    ),
  )
  return aprs.reduce((acc, apr) => Object.assign(acc, apr), {})
}
const v2PoolCakeAprBatcher = create<CakeApr, { pool: V2PoolInfo | StablePoolInfo; cakePrice: BigNumber }, CakeApr>({
  fetcher: getV2PoolsCakeApr,
  resolver: (items, query) => {
    const { pool } = query
    const key = `${pool.chainId}:${pool.lpAddress}`
    return { [key]: items[key] }
  },
  scheduler: windowedFiniteBatchScheduler({
    windowMs: 60,
    maxBatchSize: 100,
  }),
})
