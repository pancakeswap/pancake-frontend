import { ChainId, getChainNameInKebabCase } from '@pancakeswap/chains'
import {
  FarmV4SupportedChainId,
  Protocol,
  fetchAllUniversalFarms,
  masterChefV3Addresses,
  supportedChainIdV4,
} from '@pancakeswap/farms'
import { smartChefABI } from '@pancakeswap/pools'
import { getStableSwapPools } from '@pancakeswap/stable-swap-sdk'
import { FeeAmount, masterChefV3ABI } from '@pancakeswap/v3-sdk'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { GraphQLClient, gql } from 'graphql-request'
import groupBy from 'lodash/groupBy'
import { explorerApiClient } from 'state/info/api/client'
import { isAddressEqual } from 'utils'
import { v3Clients } from 'utils/graphql'
import { publicClient } from 'utils/viem'
import { type Address } from 'viem'
import { PoolInfo } from '../type'
import { parseFarmPools } from '../utils'

dayjs.extend(utc)

const DEFAULT_PROTOCOLS: Protocol[] = [Protocol.V3, Protocol.V2, Protocol.STABLE]
const DEFAULT_CHAINS: FarmV4SupportedChainId[] = Object.values(supportedChainIdV4)

type PoolIdentifier = {
  id: string
  chainId: ChainId
  protocol: 'v2' | 'v3' | 'stable' | 'v4cl' | 'v4bin'
}

type WithTvlAndVolume = {
  tvlUSD: string
  volumeUSD24h: string
}

type PoolWithTvlVolume = PoolIdentifier & WithTvlAndVolume

type V3PoolResult = {
  poolDayDatas: {
    pool: {
      id: string
    }
    volumeUSD: string
    tvlUSD: string
  }[]
}

function getPoolKey({ id, chainId, protocol }: PoolIdentifier): string {
  return `${chainId}_${id}_${protocol}`
}

function fetchV3PoolsTvlVolumeFromSubgraph(pools: PoolIdentifier[]): Promise<PoolWithTvlVolume[]>[] {
  const groupByChain = groupBy(pools, (p) => p.chainId)
  const res = Object.keys(groupByChain).map(async (chain) => {
    const poolsOnChain = groupByChain[chain]
    const chainId = Number(chain) as ChainId
    // NOTE: only fix bsc tvl and volume
    if (chainId !== ChainId.BSC) {
      return []
    }
    const client: GraphQLClient = v3Clients[chainId]
    if (!client) {
      return []
    }
    const result = await client.request<V3PoolResult>(
      gql`
        query pools($addresses: [String!]!, $startAt: Int!, $endAt: Int!) {
          poolDayDatas(first: 1000, where: { date_gte: $startAt, date_lt: $endAt, pool_in: $addresses }) {
            volumeUSD
            tvlUSD
            pool {
              id
            }
          }
        }
      `,
      {
        addresses: poolsOnChain.map((p) => p.id),
        startAt: dayjs().utc().startOf('day').subtract(1, 'days').unix(),
        endAt: dayjs().utc().startOf('day').unix(),
      },
    )
    return result.poolDayDatas.map((data) => ({
      id: data.pool.id,
      chainId,
      protocol: 'v3' as const,
      tvlUSD: data.tvlUSD,
      volumeUSD24h: data.volumeUSD,
    }))
  })
  return res
}

function createSubgraphTvlVolumeFetcher() {
  let cache: {
    [key: string]: PoolWithTvlVolume
  } = {}

  return async function fetchTvlVolumeFromSubgraph(pools: PoolIdentifier[]): Promise<{
    [key: string]: PoolWithTvlVolume
  }> {
    const groupByProtocol = groupBy(
      pools.filter((p) => !cache[getPoolKey(p)]),
      (p) => p.protocol,
    )
    const v3Pools = groupByProtocol.v3
    const res = await Promise.allSettled(fetchV3PoolsTvlVolumeFromSubgraph(v3Pools))
    const data = res.reduce<{ [key: string]: PoolWithTvlVolume }>((acc, cur) => {
      if (cur.status === 'rejected') {
        return acc
      }
      return cur.value.reduce(
        (list, p) => ({
          ...list,
          [getPoolKey(p)]: p,
        }),
        acc,
      )
    }, {})
    cache = {
      ...cache,
      ...data,
    }
    return cache
  }
}
const fetchTvlVolumeFromSubgraph = createSubgraphTvlVolumeFetcher()

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
        chains: chains.reduce((acc, cur) => {
          if (cur) {
            acc.push(getChainNameInKebabCase(cur))
          }
          return acc
        }, [] as any[]),
      },
    },
  })

  if (!resp.data) {
    return []
  }
  const tvlAndVolume = await fetchTvlVolumeFromSubgraph(resp.data)

  return parseFarmPools(
    resp.data.map((p) => {
      const infoFromSubgraph = tvlAndVolume[getPoolKey(p)]
      if (!infoFromSubgraph) return p
      return {
        ...p,
        tvlUSD: infoFromSubgraph.tvlUSD,
        volumeUSD24h: infoFromSubgraph.volumeUSD24h,
      }
    }),
    { isFarming: true },
  )
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
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw error
      }
    }
    console.error('Failed to fetch remote pools', error)
  }

  const fetchFarmConfig = await fetchAllUniversalFarms()
  const localPools = fetchFarmConfig.filter((farm) => {
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
