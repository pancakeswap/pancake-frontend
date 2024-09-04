import { getChainNameInKebabCase } from '@pancakeswap/chains'
import {
  FarmV4SupportedChainId,
  masterChefV3Addresses,
  Protocol,
  supportedChainIdV4,
  UNIVERSAL_FARMS,
} from '@pancakeswap/farms'
import { smartChefABI } from '@pancakeswap/pools'
import { getStableSwapPools } from '@pancakeswap/stable-swap-sdk'
import { FeeAmount, masterChefV3ABI } from '@pancakeswap/v3-sdk'
import { explorerApiClient } from 'state/info/api/client'
import { publicClient } from 'utils/viem'
import { isAddressEqual, type Address } from 'viem'
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
        (p.protocol === Protocol.V3 ? p.pid === farm.pid : true)
      )
    })

    if (pool) {
      return {
        ...pool,
        pid: farm.pid,
        feeTierBase: 1_000_000,
        ...(farm.protocol === 'v2' || farm.protocol === 'stable'
          ? { bCakeWrapperAddress: farm.bCakeWrapperAddress }
          : {}),
      } satisfies PoolInfo
    }

    remoteMissedPoolsIndex.push(index)

    const stablePair =
      farm.protocol === Protocol.STABLE
        ? getStableSwapPools(farm.chainId).find((p) => {
            return isAddressEqual(p.lpAddress, farm.lpAddress)
          })
        : undefined
    let feeTier = 100
    if (farm.protocol === Protocol.V3) feeTier = Number(farm.feeAmount)
    if (farm.protocol === Protocol.V2) feeTier = FeeAmount.MEDIUM
    if (stablePair) feeTier = stablePair.stableTotalFee * 1_000_000

    return {
      ...farm,
      pid: farm.pid,
      tvlUsd: undefined,
      vol24hUsd: undefined,
      feeTier,
      feeTierBase: 1_000_000,
      isFarming: true,
    } satisfies PoolInfo
  })

  // fetch ss fee
  // await

  return finalPools
}

export const fetchV3PoolsStatusByChainId = async (chainId: number, pools: { pid?: number }[]) => {
  const masterChefAddress = masterChefV3Addresses[chainId]
  const client = publicClient({ chainId })
  const poolInfoCalls = pools.map(
    (pool) =>
      ({
        functionName: 'poolInfo',
        address: masterChefAddress,
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

export const fetchPoolsTimeFrame = async (bCakeAddresses: Address[], chainId: number) => {
  if (!bCakeAddresses.length) {
    return []
  }

  const client = publicClient({ chainId })
  const calls = bCakeAddresses.flatMap((address) => {
    return [
      {
        abi: smartChefABI,
        address,
        functionName: 'startTimestamp',
      },
      {
        abi: smartChefABI,
        address,
        functionName: 'endTimestamp',
      },
    ] as const
  })

  const resp = await client.multicall({
    contracts: calls,
    allowFailure: false,
  })

  const poolTimeFrame = resp.reduce<bigint[][]>((acc, item, index) => {
    const chunkIndex = Math.floor(index / 2)
    if (!acc[chunkIndex]) {
      // eslint-disable-next-line no-param-reassign
      acc[chunkIndex] = []
    }
    acc[chunkIndex].push(item)
    return acc
  }, [])

  return bCakeAddresses.map((_, index) => {
    const [startTimestamp, endTimestamp] = poolTimeFrame[index]
    return {
      startTimestamp: Number(startTimestamp),
      endTimestamp: Number(endTimestamp),
    }
  })
}
