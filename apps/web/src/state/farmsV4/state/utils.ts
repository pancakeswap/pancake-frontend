import { Token } from '@pancakeswap/swap-sdk-core'
import { paths } from 'state/info/api/schema'
import { safeGetAddress } from 'utils'
import { PoolInfo } from './type'

export const parseFarmPools = (
  data:
    | paths['/cached/pools/farming']['get']['responses']['200']['content']['application/json']
    | paths['/cached/pools/list']['get']['responses']['200']['content']['application/json']['rows'],
): PoolInfo[] => {
  return data.map((pool) => {
    return {
      chainId: pool.chainId,
      lpAddress: safeGetAddress(pool.id)!,
      protocol: pool.protocol,
      token0: new Token(
        pool.chainId,
        safeGetAddress(pool.token0.id)!,
        pool.token0.decimals,
        pool.token0.symbol,
        pool.token0.name,
      ),
      token1: new Token(
        pool.chainId,
        safeGetAddress(pool.token1.id)!,
        pool.token1.decimals,
        pool.token1.symbol,
        pool.token1.name,
      ),
      lpApr: pool.apr24h as `${number}`,
      tvlUsd: pool.tvlUSD as `${number}`,
      vol24hUsd: pool.volumeUSD24h as `${number}`,
      feeTier: Number(pool.feeTier),
      // @todo @ChefJerry get by protocols
      feeTierBase: 1_000_000,
      // @todo @ChefJerry implement whitelist
      whitelist: false,
    } satisfies PoolInfo
  })
}
