import { getChainNameInKebabCase } from '@pancakeswap/chains'
import { FarmV4SupportedChainId, Protocol, supportedChainIdV4, UNIVERSAL_FARMS } from '@pancakeswap/farms'
import { Token } from '@pancakeswap/swap-sdk-core'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { atom } from 'jotai'
import { loadable } from 'jotai/utils'
import { explorerApiClient } from 'state/info/api/client'
import { paths } from 'state/info/api/schema'
import { safeGetAddress } from 'utils'
import { PoolInfo } from './type'

const DEFAULT_PROTOCOLS: Protocol[] = ['v3', 'v2', 'stable']
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
      lpApr: pool.apr24h as `${number}`,
      tvlUsd: pool.tvlUSD as `${number}`,
      vol24hUsd: pool.volumeUSD24h as `${number}`,
      feeTier: BigInt(pool.feeTier),
      // @todo @ChefJerry get by protocols
      feeTierBase: 1_000_000n,
    } satisfies PoolInfo
  })
}

const fetchExplorerFarmPools = async (
  args: {
    protocols?: Protocol[] // after v4 starts to be used, we can add 'v4Bin'
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

const fetchFarmPools = async (
  args: {
    protocols?: Protocol[] // after v4 starts to be used, we can add 'v4Bin'
    chainId?: FarmV4SupportedChainId | FarmV4SupportedChainId[]
  } = {
    protocols: DEFAULT_PROTOCOLS,
    chainId: DEFAULT_CHAINS,
  },
  signal?: AbortSignal,
) => {
  const remotePools = await fetchExplorerFarmPools(args, signal)
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
      tvlUsd: undefined,
      vol24hUsd: undefined,
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

// @todo @ChefJerry support args
export const farmPoolsAtom = atom(async (_, { signal }): Promise<PoolInfo[]> => {
  return fetchFarmPools({ protocols: DEFAULT_PROTOCOLS, chainId: DEFAULT_CHAINS }, signal)
})

export const asyncFarmPoolsAtom = loadable(farmPoolsAtom)
