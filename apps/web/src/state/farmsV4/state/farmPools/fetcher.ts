import { publicClient } from 'utils/viem'
import groupBy from 'lodash/groupBy'
import { getChainNameInKebabCase } from '@pancakeswap/chains'
import {
  FarmV4SupportedChainId,
  masterChefV3Addresses,
  Protocol,
  supportedChainIdV4,
  UNIVERSAL_FARMS,
} from '@pancakeswap/farms'
import { FeeAmount, masterChefV3ABI } from '@pancakeswap/v3-sdk'
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

  return parseFarmPools(resp.data, { isFarming: true })
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
  let remotePools: PoolInfo[] | undefined
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
    const pool = remotePools?.find((p) => {
      return (
        p.chainId === farm.chainId &&
        isAddressEqual(p.lpAddress, farm.lpAddress) &&
        p.protocol === farm.protocol &&
        p.pid === farm.pid
      )
    })

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
        farm.protocol === Protocol.V3 ? Number(farm.feeAmount) : farm.protocol === Protocol.V2 ? FeeAmount.MEDIUM : 100,
      feeTierBase: 1_000_000,
      isFarming: true,
    } satisfies PoolInfo
  })

  // fetch ss fee
  // await

  return finalPools
}

export const fetchPoolsStatus = async (pools: PoolInfo[]) => {
  const poolsMapByChain = groupBy(pools, 'chainId')
  const res = await Promise.allSettled(
    Object.keys(poolsMapByChain).map((chainId) => fetchPoolsStatusByChainId(Number(chainId), poolsMapByChain[chainId])),
  )
  return res.map((promise) => (promise.status === 'fulfilled' ? promise.value : []))
}

export const fetchPoolsStatusByChainId = async (chainId: number, pools: PoolInfo[]) => {
  const masterChefAddress = masterChefV3Addresses[chainId]
  const client = publicClient({ chainId })
  const poolInfoCalls = pools.map(
    (pool) =>
      ({
        address: masterChefAddress,
        functionName: 'poolInfo',
        abi: masterChefV3ABI,
        args: [BigInt(pool.pid!)],
      } as const),
  )

  const resp = await client.multicall({
    contracts: poolInfoCalls,
    allowFailure: false,
  })
  return resp
}
