import { getChainNameInKebabCase } from '@pancakeswap/chains'
import { FarmV4SupportedChainId, Protocol, supportedChainIdV4, UNIVERSAL_FARMS } from '@pancakeswap/farms'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { atom } from 'jotai'
import { loadable } from 'jotai/utils'
import { explorerApiClient } from 'state/info/api/client'
import { PoolInfo } from './type'
import { parseFarmPools } from './utils'

const DEFAULT_PROTOCOLS: Protocol[] = ['v3', 'v2', 'stable']
const DEFAULT_CHAINS: FarmV4SupportedChainId[] = Object.values(supportedChainIdV4)

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
