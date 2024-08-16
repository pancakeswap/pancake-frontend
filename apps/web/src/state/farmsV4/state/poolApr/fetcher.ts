import { Protocol, supportedChainIdV4, UNIVERSAL_BCAKEWRAPPER_FARMS } from '@pancakeswap/farms'
import { LegacyRouter } from '@pancakeswap/smart-router/legacy-router'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { masterChefV3ABI } from '@pancakeswap/v3-sdk'
import { create, windowedFiniteBatchScheduler } from '@yornaath/batshit'
import BigNumber from 'bignumber.js'
import { SECONDS_PER_YEAR } from 'config'
import { v2BCakeWrapperABI } from 'config/abi/v2BCakeWrapper'
import { getCakePriceFromOracle } from 'hooks/useCakePrice'
import assign from 'lodash/assign'
import groupBy from 'lodash/groupBy'
import set from 'lodash/set'
import { chainIdToExplorerInfoChainName, explorerApiClient } from 'state/info/api/client'
import { safeGetAddress } from 'utils'
import { getMasterChefV3Contract, getV2SSBCakeWrapperContract } from 'utils/contractHelpers'
import { publicClient } from 'utils/wagmi'
import { Address, erc20Abi, isAddressEqual } from 'viem'
import { PoolInfo, StablePoolInfo, V2PoolInfo, V3PoolInfo } from '../type'
import { CakeApr, MerklApr } from './atom'

export const getCakeApr = (pool: PoolInfo): Promise<CakeApr> => {
  switch (pool.protocol) {
    case 'v3':
      return v3PoolCakeAprBatcher.fetch(pool)
    case 'v2':
    case 'stable':
      return v2PoolCakeAprBatcher.fetch(pool)
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
    poolInfo: readonly [bigint, `0x${string}`, `0x${string}`, `0x${string}`, number, bigint, bigint]
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

  const hasCache = masterChefV3CacheMap.has(pool.chainId)

  const [totalAllocPoint, latestPeriodCakePerSecond, poolInfo] = await Promise.all([
    hasCache ? masterChefV3CacheMap.get(pool.chainId)!.totalAllocPoint : masterChefV3.read.totalAllocPoint(),
    hasCache
      ? masterChefV3CacheMap.get(pool.chainId)!.latestPeriodCakePerSecond
      : masterChefV3.read.latestPeriodCakePerSecond(),
    hasCache ? masterChefV3CacheMap.get(pool.chainId)!.poolInfo : masterChefV3.read.poolInfo([BigInt(pool.pid)]),
  ])

  if (!hasCache) masterChefV3CacheMap.set(pool.chainId, { totalAllocPoint, latestPeriodCakePerSecond, poolInfo })

  const cakePerYear = new BigNumber(SECONDS_PER_YEAR)
    .times(latestPeriodCakePerSecond.toString())
    .dividedBy(1e18)
    .dividedBy(1e12)
  const cakePerYearUsd = cakePrice.times(cakePerYear.toString())
  const [allocPoint, , , , , totalLiquidity, totalBoostLiquidity] = poolInfo
  const poolWeight = new BigNumber(allocPoint.toString()).dividedBy(totalAllocPoint.toString())
  const liquidityBooster = new BigNumber(totalBoostLiquidity.toString()).dividedBy(totalLiquidity.toString())

  const baseApr = cakePerYearUsd.times(poolWeight).dividedBy(liquidityBooster.times(pool.tvlUsd ?? 1))

  return {
    value: baseApr.toString() as `${number}`,
    boost: baseApr.times(2).toString() as `${number}`, //
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
}: {
  pool: V3PoolInfo
  cakePrice: BigNumber
  totalAllocPoint: bigint
  latestPeriodCakePerSecond: bigint
  poolInfo: readonly [bigint, `0x${string}`, `0x${string}`, `0x${string}`, number, bigint, bigint]
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

  const baseApr = liquidityBooster.isZero()
    ? BIG_ZERO
    : cakePerYearUsd.times(poolWeight).dividedBy(liquidityBooster.times(pool.tvlUsd ?? 1))

  return {
    value: baseApr.toString() as `${number}`,
    boost: baseApr.times(2).toString() as `${number}`,
    cakePerYear,
    poolWeight,
  }
}

export const getUniversalBCakeWrapperForPool = (pool: { lpAddress: Address; chainId: number; protocol?: Protocol }) => {
  let { lpAddress } = pool
  if (pool.protocol === 'stable') {
    const stablePair = LegacyRouter.stableSwapPairsByChainId[pool.chainId].find((pair) => {
      return isAddressEqual(pair.stableSwapAddress, pool.lpAddress)
    })
    if (stablePair) {
      lpAddress = stablePair.liquidityToken.address
    }
  }
  const config = UNIVERSAL_BCAKEWRAPPER_FARMS.find(
    (farm) => isAddressEqual(farm.lpAddress, lpAddress) && farm.chainId === pool.chainId,
  )

  return config
}

export const DEFAULT_V2_CAKE_APR_BOOS_MULTIPLIER = 2.5
export const getV2PoolCakeApr = async (
  pool: V2PoolInfo | StablePoolInfo,
  cakePrice: BigNumber,
): Promise<{ value: `${number}`; boost?: `${number}` }> => {
  const config = getUniversalBCakeWrapperForPool(pool)
  const client = publicClient({ chainId: pool.chainId })
  if (!config || !client) {
    return {
      value: '0',
      boost: '0',
    }
  }
  const { bCakeWrapperAddress } = config

  const bCakeWrapperContract = getV2SSBCakeWrapperContract(bCakeWrapperAddress, undefined, pool.chainId)
  const cakePerSecond = await bCakeWrapperContract.read.rewardPerSecond()
  const cakeOneYearUsd = cakePrice.times((cakePerSecond * BigInt(SECONDS_PER_YEAR)).toString()).dividedBy(1e18)

  const baseApr = cakeOneYearUsd.dividedBy(pool.tvlUsd ?? 1)

  return {
    value: baseApr.toString() as `${number}`,
    boost: baseApr.times(DEFAULT_V2_CAKE_APR_BOOS_MULTIPLIER).toString() as `${number}`,
  }
}

export const getMerklApr = async (chainId: number) => {
  try {
    // @todo @ChefJerry merkl api cannot accept multiple chainIds, we need to batch fetch
    const resp = await fetch(`https://api.angle.money/v2/merkl?chainIds=${chainId}&AMMs=pancakeswapv3`)
    if (resp.ok) {
      const result = await resp.json()
      if (!result[chainId] || !result[chainId].pools) return {}
      return Object.keys(result[chainId].pools).reduce((acc, poolId) => {
        const key = `${chainId}:${safeGetAddress(poolId)}`
        if (!result[chainId].pools[poolId].aprs || !Object.keys(result[chainId].pools[poolId].aprs).length) return acc

        const apr = result[chainId].pools[poolId].aprs?.['Average APR (rewards / pool TVL)'] ?? '0'
        return {
          ...acc,
          [key]: apr / 100,
        }
      }, {} as MerklApr)
    }
    throw resp
  } catch (error) {
    console.error('Failed to fetch merkl apr', error)
    return {}
  }
}

export const getAllNetworkMerklApr = async () => {
  const aprs = await Promise.all(supportedChainIdV4.map((chainId) => getMerklApr(chainId)))
  return aprs.reduce((acc, apr) => assign(acc, apr), {})
}

const getV3PoolsCakeAprByChainId = async (pools: V3PoolInfo[], chainId: number, cakePrice: BigNumber) => {
  const masterChefV3 = getMasterChefV3Contract(undefined, chainId)
  const client = publicClient({ chainId })

  if (!masterChefV3 || !client) return {}

  const validPools = pools.filter((pool) => {
    return pool.pid && pool.chainId === chainId
  })

  const masterChefV3Cache = masterChefV3CacheMap.get(chainId)
  const [totalAllocPoint, latestPeriodCakePerSecond] = await Promise.all([
    masterChefV3Cache ? masterChefV3Cache.totalAllocPoint : masterChefV3.read.totalAllocPoint(),
    masterChefV3Cache ? masterChefV3Cache.latestPeriodCakePerSecond : masterChefV3.read.latestPeriodCakePerSecond(),
    getCakePriceFromOracle(),
  ])

  const poolInfoCalls = validPools.map(
    (pool) =>
      ({
        address: masterChefV3.address,
        functionName: 'poolInfo',
        abi: masterChefV3ABI,
        args: [BigInt(pool.pid!)],
      } as const),
  )

  const poolInfos = await client.multicall({
    contracts: poolInfoCalls,
    allowFailure: false,
  })

  return validPools.reduce((acc, pool, index) => {
    const poolInfo = poolInfos[index]
    if (!poolInfo) return acc
    const key = `${chainId}:${safeGetAddress(pool.lpAddress)}`
    set(acc, key, calcV3PoolApr({ pool, cakePrice, totalAllocPoint, latestPeriodCakePerSecond, poolInfo }))
    return acc
  }, {} as CakeApr)
}

const getV3PoolsCakeApr = async (pools: V3PoolInfo[]): Promise<CakeApr> => {
  const cakePrice = await getCakePrice()
  const poolsByChainId = groupBy(pools, 'chainId')
  const aprs = await Promise.all(
    Object.keys(poolsByChainId).map((chainId) =>
      getV3PoolsCakeAprByChainId(poolsByChainId[Number(chainId)], Number(chainId), cakePrice),
    ),
  )
  return aprs.reduce((acc, apr) => assign(acc, apr), {})
}

const v3PoolCakeAprBatcher = create<CakeApr, V3PoolInfo, CakeApr>({
  fetcher: getV3PoolsCakeApr,
  resolver: (items, query) => {
    const key = `${query.chainId}:${query.lpAddress}`
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
}: {
  pool: V2PoolInfo | StablePoolInfo
  cakePrice: BigNumber
  cakePerSecond: bigint
  totalBoostShare: bigint
  totalSupply: bigint
}) => {
  const cakePerYear = new BigNumber(SECONDS_PER_YEAR).times(cakePerSecond.toString()).dividedBy(1e18)
  const cakeOneYearUsd = cakePrice.times(cakePerYear.toString())
  const usdPerShare = new BigNumber(pool.tvlUsd ?? 0).times(1e18).div(totalSupply.toString() ?? 1)
  const farmingTVLUsd = usdPerShare.times(totalBoostShare.toString() ?? 0).dividedBy(1e18)

  const baseApr = cakeOneYearUsd.dividedBy((farmingTVLUsd ?? 1).toString())

  return {
    value: baseApr.toString() as `${number}`,
    boost: baseApr.times(2.5).toString() as `${number}`,
    cakePerYear,
  }
}

const cakePriceCache = {
  value: new BigNumber(0),
  timestamp: 0,
}
const getCakePrice = async () => {
  const now = Date.now()
  // cache for 10 minutes
  if (now - cakePriceCache.timestamp < 1000 * 60 * 10) {
    return cakePriceCache.value
  }
  return new BigNumber(await getCakePriceFromOracle())
}
const getV2PoolsCakeAprByChainId = async (
  pools: Array<V2PoolInfo | StablePoolInfo>,
  chainId: number,
  cakePrice: BigNumber,
) => {
  const client = publicClient({ chainId })
  const validPools = pools.reduce((prev, pool) => {
    if (pool.chainId !== chainId) return prev
    const bCakeWrapperAddress = getUniversalBCakeWrapperForPool(pool)?.bCakeWrapperAddress
    if (!bCakeWrapperAddress) return prev
    prev.push({ ...pool, bCakeWrapperAddress })
    return prev
  }, [] as (PoolInfo & { bCakeWrapperAddress: Address })[])

  const rewardPerSecondCalls = validPools.map((pool) => {
    return {
      address: pool.bCakeWrapperAddress,
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

  const totalBoostedShareCalls = validPools.map((pool) => {
    return {
      address: pool.bCakeWrapperAddress,
      functionName: 'totalBoostedShare',
      abi: v2BCakeWrapperABI,
    } as const
  })

  const [rewardPerSecondResults, totalBoostedShareResults, totalSupplies] = await Promise.all([
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
  ])

  return validPools.reduce((acc, pool, index) => {
    const rewardPerSecond = rewardPerSecondResults[index]
    const totalBoostShare = totalBoostedShareResults[index]
    if (!rewardPerSecond) return acc
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
      }),
    )
    return acc
  }, {} as CakeApr)
}
const getV2PoolsCakeApr = async (pools: Array<V2PoolInfo | StablePoolInfo>): Promise<CakeApr> => {
  const cakePrice = await getCakePrice()
  const poolsByChainId = groupBy(pools, 'chainId')
  const aprs = await Promise.all(
    Object.keys(poolsByChainId).map((chainId) =>
      getV2PoolsCakeAprByChainId(poolsByChainId[Number(chainId)], Number(chainId), cakePrice),
    ),
  )
  return aprs.reduce((acc, apr) => assign(acc, apr), {})
}
const v2PoolCakeAprBatcher = create<CakeApr, V2PoolInfo | StablePoolInfo, CakeApr>({
  fetcher: getV2PoolsCakeApr,
  resolver: (items, query) => {
    const key = `${query.chainId}:${query.lpAddress}`
    return { [key]: items[key] }
  },
  scheduler: windowedFiniteBatchScheduler({
    windowMs: 60,
    maxBatchSize: 100,
  }),
})
