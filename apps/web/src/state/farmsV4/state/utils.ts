import { Protocol, UNIVERSAL_FARMS } from '@pancakeswap/farms'
import { LegacyRouter } from '@pancakeswap/smart-router/legacy-router'
import { Token } from '@pancakeswap/swap-sdk-core'
import { getTokenByAddress } from '@pancakeswap/tokens'
import BN from 'bignumber.js'
import { paths } from 'state/info/api/schema'
import { safeGetAddress } from 'utils'
import { Address, isAddressEqual } from 'viem'
import { PoolInfo } from './type'

export const parseFarmPools = (
  data:
    | paths['/cached/pools/farming']['get']['responses']['200']['content']['application/json']
    | paths['/cached/pools/list']['get']['responses']['200']['content']['application/json']['rows']
    | paths['/cached/pools/{chainName}/{id}']['get']['responses']['200']['content']['application/json'][],
  options: { isFarming?: boolean } = {},
): PoolInfo[] => {
  return data.map((pool) => {
    let stableSwapAddress: Address | undefined
    let lpAddress = safeGetAddress(pool.id)!
    let feeTier = Number(pool.feeTier ?? 2500)
    if (pool.protocol === 'stable') {
      const stableConfig = LegacyRouter.stableSwapPairsByChainId[pool.chainId]?.find((pair) => {
        return isAddressEqual(pair.stableSwapAddress, pool.id as Address)
      })
      if (stableConfig) {
        stableSwapAddress = safeGetAddress(stableConfig.stableSwapAddress)
        lpAddress = safeGetAddress(stableConfig.lpAddress)!
        feeTier = stableConfig.stableTotalFee * 1000000
      }
    }
    const localFarm = UNIVERSAL_FARMS.find(
      (farm) => isAddressEqual(farm.lpAddress, lpAddress) && farm.chainId === pool.chainId,
    )
    let pid: number | undefined
    if (localFarm) {
      // eslint-disable-next-line prefer-destructuring
      pid = Number(localFarm.pid) ?? undefined
    }
    const token0Address = safeGetAddress(pool.token0.id)!
    const token0 =
      getTokenByAddress(pool.chainId, token0Address) ??
      new Token(pool.chainId, token0Address, pool.token0.decimals, pool.token0.symbol, pool.token0.name)
    const token1Address = safeGetAddress(pool.token1.id)!
    const token1 =
      getTokenByAddress(pool.chainId, token1Address) ??
      new Token(pool.chainId, token1Address, pool.token1.decimals, pool.token1.symbol, pool.token1.name)
    return {
      chainId: pool.chainId,
      pid,
      lpAddress,
      stableSwapAddress,
      protocol: pool.protocol as Protocol,
      token0,
      token1,
      token0Price: (pool.token0Price as `${number}`) ?? '0',
      token1Price: (pool.token1Price as `${number}`) ?? '0',
      tvlToken0: (pool.tvlToken0 as `${number}`) ?? '0',
      tvlToken1: (pool.tvlToken1 as `${number}`) ?? '0',
      lpApr: pool.apr24h as `${number}`,
      tvlUsd: pool.tvlUSD as `${number}`,
      tvlUsd24h: pool.tvlUSD24h as `${number}`,
      vol24hUsd: pool.volumeUSD24h as `${number}`,
      vol48hUsd: pool.volumeUSD48h as `${number}`,
      vol7dUsd: pool.volumeUSD7d as `${number}`,
      totalFeeUSD: pool.totalFeeUSD as `${number}`,
      fee24hUsd: pool.feeUSD24h as `${number}`,
      liquidity: pool.liquidity,
      feeTier,
      feeTierBase: 1_000_000,
      isFarming: !!options?.isFarming,
    } satisfies PoolInfo
  })
}

export const getPoolMultiplier = (allocPoint: bigint) => {
  if (typeof allocPoint === 'undefined') {
    return `0X`
  }
  return `${+new BN(allocPoint.toString()).div(10).toString()}X`
}
