import { getChainNameInKebabCase } from '@pancakeswap/chains'
import { FarmV4SupportedChainId, Protocol, supportedChainIdV4, UNIVERSAL_FARMS } from '@pancakeswap/farms'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { explorerApiClient } from 'state/info/api/client'
import { isAddressEqual } from 'viem'
import { PoolInfo } from '../type'
import { parseFarmPools } from '../utils'

const DEFAULT_PROTOCOLS: Protocol[] = [Protocol.V3, Protocol.V2, Protocol.STABLE]
const DEFAULT_CHAINS: FarmV4SupportedChainId[] = Object.values(supportedChainIdV4)

export const fetchExplorerFarmPools = async (
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

export const fetchFarmPools = async (
  args: {
    protocols?: Protocol[] // after v4 starts to be used, we can add 'v4Bin'
    chainId?: FarmV4SupportedChainId | FarmV4SupportedChainId[]
  } = {
    protocols: DEFAULT_PROTOCOLS,
    chainId: DEFAULT_CHAINS,
  },
  signal?: AbortSignal,
) => {
  let remotePools: PoolInfo[]
  try {
    remotePools = await fetchExplorerFarmPools(args, signal)
  } catch (error) {
    console.error('Failed to fetch remote pools', error)
  }
  const localPools = UNIVERSAL_FARMS.filter((farm) => {
    return (
      args.protocols?.includes(farm.protocol) &&
      (Array.isArray(args.chainId) ? args.chainId.includes(farm.chainId) : farm.chainId === args.chainId)
    )
  })
  const remoteMissedPoolsIndex: number[] = []

  const finalPools = localPools.map((farm, index) => {
    const pool = remotePools.find(
      (p) => isAddressEqual(p.lpAddress, farm.lpAddress) && p.chainId === farm.chainId && p.protocol === farm.protocol,
    )

    if (pool)
      return {
        ...pool,
        pid: farm.pid,
        feeTierBase: 1_000_000,
      } satisfies PoolInfo

    remoteMissedPoolsIndex.push(index)

    // @todo @ChefJerry fetch on-chain with default data
    return {
      ...farm,
      pid: farm.pid,
      tvlUsd: undefined,
      vol24hUsd: undefined,
      feeTier:
        farm.protocol === Protocol.V3 ? Number(farm.feeAmount) : farm.protocol === Protocol.V2 ? FeeAmount.MEDIUM : 100, // @todo @ChefJerry add stable fee
      // @todo @ChefJerry get by protocols
      feeTierBase: 1_000_000,
    } satisfies PoolInfo
  })

  // fetch ss fee
  // await

  return finalPools
}
