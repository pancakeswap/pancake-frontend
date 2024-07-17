import { UNIVERSAL_BCAKEWRAPPER_FARMS } from '@pancakeswap/farms'
import BigNumber from 'bignumber.js'
import { SECONDS_PER_YEAR } from 'config'
import { atom } from 'jotai'
import { getMasterChefV3Contract, getV2SSBCakeWrapperContract } from 'utils/contractHelpers'
import { publicClient } from 'utils/wagmi'
import { isAddressEqual } from 'viem/_types/utils/address/isAddressEqual'
import { ChainIdAddressKey, PoolInfo, StablePoolInfo, V2PoolInfo, V3PoolInfo } from './type'

export type PoolAprDetail = {
  lpApr: {
    value: `${number}`
  }
  cakeApr: {
    // default apr
    value: `${number}`
    // apr with boost, not related to user account
    boost?: `${number}`
  }
  // @todo @ChefJerry implement merklApr
  merklApr: {
    value: `${number}`
  }
}

export type PoolApr = Record<ChainIdAddressKey, PoolAprDetail>

export const poolAprAtom = atom<PoolApr>({} as PoolApr)

export const poolAprSetterAtom = atom(null, (get, set, update: PoolApr) => {
  set(poolAprAtom, { ...get(poolAprAtom), ...update })
})

export const getCakeApr = (pool: V2PoolInfo | V3PoolInfo | StablePoolInfo, cakePrice: BigNumber) => {
  switch (pool.protocol) {
    case 'v3':
      return getV3PoolCakeApr(pool, cakePrice)
    case 'v2':
    case 'stable':
      return getV2PoolCakeApr(pool, cakePrice)
    default:
      return {
        value: '0',
      }
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

export const getV3PoolCakeApr = async (pool: V3PoolInfo, cakePrice: BigNumber) => {
  const { tvlUsd } = pool
  const client = publicClient({ chainId: pool.chainId })
  const masterChefV3 = getMasterChefV3Contract(undefined, pool.chainId)

  if (!tvlUsd || !client || !masterChefV3 || !pool.pid) {
    return {
      value: '0',
    }
  }

  const hasCache = masterChefV3CacheMap.has(pool.chainId)

  const [poolWeight, totalAllocPoint, latestPeriodCakePerSecond, poolInfo] = await Promise.all([
    masterChefV3.read.poolInfo([BigInt(pool.pid)]),
    hasCache ? masterChefV3CacheMap.get(pool.chainId)!.totalAllocPoint : masterChefV3.read.totalAllocPoint(),
    hasCache
      ? masterChefV3CacheMap.get(pool.chainId)!.latestPeriodCakePerSecond
      : masterChefV3.read.latestPeriodCakePerSecond(),
    hasCache ? masterChefV3CacheMap.get(pool.chainId)!.poolInfo : masterChefV3.read.poolInfo([BigInt(pool.pid)]),
  ])

  if (!hasCache) masterChefV3CacheMap.set(pool.chainId, { totalAllocPoint, latestPeriodCakePerSecond, poolInfo })

  const cakePerSecond = latestPeriodCakePerSecond / BigInt(1e18) / BigInt(1e12)
  const cakePerYearUsd = cakePrice.times((cakePerSecond * BigInt(SECONDS_PER_YEAR)).toString())
  const [, , , , , totalLiquidity, totalBoostLiquidity] = poolInfo

  const baseApr = cakePerYearUsd
    .times(poolWeight.toString())
    .dividedBy(pool.tvlUsd ?? 1)
    .times(totalLiquidity.toString())
    .dividedBy(totalBoostLiquidity.toString())

  return {
    value: baseApr.toString(),
    boost: baseApr.times(2).toString(),
  }
}

export const getUniversalBCakeWrapperForPool = (pool: PoolInfo) => {
  const config = UNIVERSAL_BCAKEWRAPPER_FARMS.find(
    (farm) => isAddressEqual(farm.lpAddress, pool.lpAddress) && farm.chainId === pool.chainId,
  )

  return config
}

export const getV2PoolCakeApr = async (pool: V2PoolInfo | StablePoolInfo, cakePrice: BigNumber) => {
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
    value: baseApr.toString(),
    boost: baseApr.times(2.5).toString(),
  }
}
