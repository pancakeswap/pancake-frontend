import { getChainNameInKebabCase } from '@pancakeswap/chains'
import type { FarmV4SupportedChainId } from '@pancakeswap/farms'
import { supportedChainIdV4, UNIVERSAL_FARMS } from '@pancakeswap/farms'
import { Currency, Token } from '@pancakeswap/sdk'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { atom } from 'jotai'
import type { Address } from 'viem'
import { safeGetAddress } from '../../utils'
import { explorerApiClient } from '../info/api/client'
import { paths } from '../info/api/schema'

const DEFAULT_PROTOCOLS: PoolProtocol[] = ['v3', 'v2', 'stable']
const DEFAULT_CHAINS: FarmV4SupportedChainId[] = Object.values(supportedChainIdV4)

const parseFarmPools = (
  data: paths['/cached/pools/farming']['get']['responses']['200']['content']['application/json'],
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
      tvlUsd: pool.tvlUSD,
      vol24hUsd: pool.volumeUSD24h,
      feeTier: BigInt(pool.feeTier),
      // @todo @ChefJerry get by protocols
      feeTierBase: 1_000_000n,
    } satisfies PoolInfo
  })
}

const fetchExplorerFarmPools = async (
  args: {
    protocols?: PoolProtocol[] // after v4 starts to be used, we can add 'v4Bin'
    chainId?: FarmV4SupportedChainId | FarmV4SupportedChainId[]
  } = {
    protocols: DEFAULT_PROTOCOLS,
    chainId: DEFAULT_CHAINS,
  },
  signal?: AbortSignal,
): Promise<PoolInfo[]> => {
  let chains = Array.isArray(args?.chainId) ? args.chainId ?? [] : [args?.chainId]
  chains = chains.filter(Boolean)

  const resp = await explorerApiClient.GET('/cached/pools/farming', {
    signal,
    params: {
      query: {
        protocols: args.protocols ?? DEFAULT_PROTOCOLS,
        chains: chains.reduce((acc, cur) => (cur ? [...acc, getChainNameInKebabCase(cur)] : acc), [] as any[]),
      },
    },
  })

  if (!resp.data) {
    return []
  }

  return parseFarmPools(resp.data)
}

export const fetchFarmPools = async (
  args: {
    protocols?: PoolProtocol[] // after v4 starts to be used, we can add 'v4Bin'
    chainId?: FarmV4SupportedChainId | FarmV4SupportedChainId[]
  } = {
    protocols: DEFAULT_PROTOCOLS,
    chainId: DEFAULT_CHAINS,
  },
) => {
  const remotePools = await fetchExplorerFarmPools(args)
  const localPools = UNIVERSAL_FARMS.filter((farm) => {
    return (
      args.protocols?.includes(farm.protocol) &&
      (Array.isArray(args.chainId) ? args.chainId.includes(farm.chainId) : farm.chainId === args.chainId)
    )
  })
  const remoteMissedPoolsIndex: number[] = []

  const finalPools = localPools.map((farm, index) => {
    const pool = remotePools.find(
      (p) => p.lpAddress === farm.lpAddress && p.chainId === farm.chainId && p.protocol === farm.protocol,
    )

    if (pool) return pool

    remoteMissedPoolsIndex.push(index)

    // @todo @ChefJerry fetch on-chain with default data
    return {
      ...farm,
      tvlUsd: '0', // simple keep it 0 as default
      vol24hUsd: '0', // simple keep it 0 as default
      feeTier:
        farm.protocol === 'v3' ? BigInt(farm.feeAmount) : farm.protocol === 'v2' ? BigInt(FeeAmount.MEDIUM) : 100n, // @todo @ChefJerry add stable fee
      // @todo @ChefJerry get by protocols
      feeTierBase: 1_000_000n,
    } satisfies PoolInfo
  })

  // fetch ss fee
  // await

  return finalPools
}

export type PoolProtocol = 'v2' | 'stable' | 'v3' | 'v4bin'

export type PoolInfo = {
  chainId: number
  lpAddress: Address
  protocol: PoolProtocol
  token0: Currency
  token1: Token
  tvlUsd: string
  vol24hUsd: string
  feeTier: bigint
  feeTierBase: bigint
}

export const farmPoolsAtom = atom<PoolInfo[]>([])
