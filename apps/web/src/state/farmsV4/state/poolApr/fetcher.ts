import { supportedChainIdV4, UNIVERSAL_BCAKEWRAPPER_FARMS } from '@pancakeswap/farms'
import BigNumber from 'bignumber.js'
import { SECONDS_PER_YEAR } from 'config'
import { safeGetAddress } from 'utils'
import { getMasterChefV3Contract, getV2SSBCakeWrapperContract } from 'utils/contractHelpers'
import { publicClient } from 'utils/wagmi'
import { isAddressEqual } from 'viem'
import { PoolInfo, StablePoolInfo, V2PoolInfo, V3PoolInfo } from '../type'
import { MerklApr } from './atom'

export const getCakeApr = (
  pool: PoolInfo,
  cakePrice: BigNumber,
): Promise<{ value: `${number}`; boost?: `${number}` }> => {
  switch (pool.protocol) {
    case 'v3':
      return getV3PoolCakeApr(pool, cakePrice)
    case 'v2':
    case 'stable':
      return getV2PoolCakeApr(pool, cakePrice)
    default:
      return Promise.resolve({
        value: '0',
      })
  }
}

const masterChefV3CacheMap = new Map<
  number,
  {
    totalAllocPoint: bigint
    latestPeriodCakePerSecond: bigint
    poolInfo: readonly [bigint, `0x${string}`, `0x${string}`, `0x${string}`, number, bigint, bigint]
  }
>()

// @todo refactor to batch fetch
export const getV3PoolCakeApr = async (
  pool: V3PoolInfo,
  cakePrice: BigNumber,
): Promise<{ value: `${number}`; boost?: `${number}` }> => {
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

  const cakePerYear = (BigInt(SECONDS_PER_YEAR) * latestPeriodCakePerSecond) / BigInt(1e18) / BigInt(1e12)
  const cakePerYearUsd = cakePrice.times(cakePerYear.toString())
  const [allocPoint, , , , , totalLiquidity, totalBoostLiquidity] = poolInfo
  const poolWeight = new BigNumber(allocPoint.toString()).dividedBy(totalAllocPoint.toString())

  const baseApr = cakePerYearUsd
    .times(poolWeight)
    .dividedBy(pool.tvlUsd ?? 1)
    .times(totalLiquidity.toString())
    .dividedBy(totalBoostLiquidity.toString())

  return {
    value: baseApr.toString() as `${number}`,
    boost: baseApr.times(2).toString() as `${number}`, //
  }
}

export const getUniversalBCakeWrapperForPool = (pool: PoolInfo) => {
  const config = UNIVERSAL_BCAKEWRAPPER_FARMS.find(
    (farm) => isAddressEqual(farm.lpAddress, pool.lpAddress) && farm.chainId === pool.chainId,
  )

  return config
}

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
  const cakeOneYearUsd = cakePrice.times((cakePerSecond * BigInt(SECONDS_PER_YEAR)).toString())

  const baseApr = cakeOneYearUsd.dividedBy(pool.tvlUsd ?? 1)

  return {
    value: baseApr.toString() as `${number}`,
    boost: baseApr.times(2.5).toString() as `${number}`,
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
  return aprs.reduce((acc, apr) => ({ ...acc, ...apr }), {})
}
