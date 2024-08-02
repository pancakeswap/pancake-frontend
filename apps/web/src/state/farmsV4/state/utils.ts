import type { ChainId } from '@pancakeswap/chains'
import { Protocol } from '@pancakeswap/farms'
import { Token } from '@pancakeswap/swap-sdk-core'
import { getTokensByChain } from '@pancakeswap/tokens'
import find from 'lodash/find'
import { paths } from 'state/info/api/schema'
import { safeGetAddress } from 'utils'
import type { Address } from 'viem/accounts'
import { PoolInfo } from './type'

export const parseFarmPools = (
  data:
    | paths['/cached/pools/farming']['get']['responses']['200']['content']['application/json']
    | paths['/cached/pools/list']['get']['responses']['200']['content']['application/json']['rows']
    | paths['/cached/pools/{chainName}/{id}']['get']['responses']['200']['content']['application/json'][],
): PoolInfo[] => {
  return data.map((pool) => {
    return {
      chainId: pool.chainId,
      lpAddress: safeGetAddress(pool.id)!,
      protocol: pool.protocol as Protocol,
      token0: new Token(
        pool.chainId,
        safeGetAddress(pool.token0.id)!,
        pool.token0.decimals,
        pool.token0.symbol,
        pool.token0.name,
      ),
      token0Price: (pool.token0Price as `${number}`) ?? '0',
      token1Price: (pool.token1Price as `${number}`) ?? '0',
      tvlToken0: (pool.tvlToken0 as `${number}`) ?? '0',
      tvlToken1: (pool.tvlToken1 as `${number}`) ?? '0',
      token1: new Token(
        pool.chainId,
        safeGetAddress(pool.token1.id)!,
        pool.token1.decimals,
        pool.token1.symbol,
        pool.token1.name,
      ),
      lpApr: pool.apr24h as `${number}`,
      tvlUsd: pool.tvlUSD as `${number}`,
      tvlUsd24h: pool.tvlUSD24h as `${number}`,
      vol24hUsd: pool.volumeUSD24h as `${number}`,
      vol48hUsd: pool.volumeUSD48h as `${number}`,
      totalFeeUSD: pool.totalFeeUSD as `${number}`,
      feeTier: Number(pool.feeTier),
      // @todo @ChefJerry get by protocols
      feeTierBase: 1_000_000,
      // @todo @ChefJerry implement whitelist
      whitelist: false,
    } satisfies PoolInfo
  })
}

export default function getTokenByAddress(chainId: ChainId, address: Address) {
  const tokens = getTokensByChain(chainId)
  return find(tokens, (token) => token.address === address)
}
