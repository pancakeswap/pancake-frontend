import { ChainId, Currency } from '@pancakeswap/sdk'
import { SmartRouter, V3Pool } from '@pancakeswap/smart-router/evm'
import { computePoolAddress, DEPLOYER_ADDRESSES, FeeAmount, Tick } from '@pancakeswap/v3-sdk'
import { useEffect, useMemo, useRef } from 'react'
import useSWRImmutable from 'swr/immutable'
import { useQuery } from '@tanstack/react-query'
import { getViemClients } from 'utils/viem'

import { v3Clients } from 'utils/graphql'

import { getPoolTicks } from './v3/useAllV3TicksQuery'

type Pair = [Currency, Currency]

export interface V3PoolsHookParams {
  // Used for caching
  key?: string
  blockNumber?: number
  enabled?: boolean
}

export interface V3PoolsResult {
  refresh: () => void
  pools: V3Pool[] | null
  loading: boolean
  syncing: boolean
  blockNumber?: number
  error?: Error
}

export function useV3CandidatePools(
  currencyA?: Currency,
  currencyB?: Currency,
  options?: V3PoolsHookParams,
): V3PoolsResult {
  const {
    pools: candidatePoolsWithoutTicks,
    loading: isLoading,
    syncing: isValidating,
    key,
    blockNumber,
    refresh,
    error,
  } = useV3CandidatePoolsWithoutTicks(currencyA, currencyB, options)

  const {
    data,
    isLoading: ticksLoading,
    isValidating: ticksValidating,
  } = useV3PoolsWithTicks(candidatePoolsWithoutTicks, {
    key,
    blockNumber,
    enabled: options?.enabled,
  })

  const candidatePools = data?.pools ?? null

  return {
    refresh,
    error,
    pools: candidatePools,
    loading: isLoading || ticksLoading,
    syncing: isValidating || ticksValidating,
    blockNumber: data?.blockNumber,
  }
}

export function useV3CandidatePoolsWithoutTicks(
  currencyA?: Currency,
  currencyB?: Currency,
  options?: V3PoolsHookParams,
) {
  const key = useMemo(() => {
    if (!currencyA || !currencyB || currencyA.wrapped.equals(currencyB.wrapped)) {
      return ''
    }
    const symbols = currencyA.wrapped.sortsBefore(currencyB.wrapped)
      ? [currencyA.symbol, currencyB.symbol]
      : [currencyB.symbol, currencyA.symbol]
    return [...symbols, currencyA.chainId].join('_')
  }, [currencyA, currencyB])

  const pairs = useMemo(() => {
    SmartRouter.metric('Getting pairs from', currencyA?.symbol, currencyB?.symbol)
    return currencyA && currencyB && SmartRouter.getPairCombinations(currencyA, currencyB)
  }, [currencyA, currencyB])

  const {
    data: poolsFromSubgraphState,
    isLoading,
    isValidating,
    mutate,
    error,
  } = useV3PoolsFromSubgraph(pairs, { ...options, key })

  const { data: poolsFromOnChain } = useQuery({
    queryKey: ['v3_pools_onchain', key],
    queryFn: async () => {
      return SmartRouter.getV3PoolsWithoutTicksOnChain(pairs, getViemClients)
    },
    enabled: Boolean(error && key && options.enabled),
    keepPreviousData: true,
  })

  const candidatePools = useMemo<V3Pool[] | null>(() => {
    if (!currencyA || !currencyB) {
      return null
    }
    if (error && poolsFromOnChain) {
      return poolsFromOnChain
    }
    if (!poolsFromSubgraphState?.pools) {
      return null
    }
    return SmartRouter.v3PoolSubgraphSelection(currencyA, currencyB, poolsFromSubgraphState.pools)
  }, [poolsFromSubgraphState, currencyA, currencyB, error, poolsFromOnChain])

  return {
    refresh: mutate,
    pools: candidatePools,
    loading: isLoading,
    syncing: isValidating,
    blockNumber: poolsFromSubgraphState?.blockNumber,
    key: poolsFromSubgraphState?.key,
    error,
  }
}

export function useV3PoolsWithTicks(
  pools: V3Pool[] | null | undefined,
  { key, blockNumber, enabled = true }: V3PoolsHookParams = {},
) {
  const fetchingBlock = useRef<string | null>(null)
  const poolsWithTicks = useSWRImmutable(
    key && pools && enabled ? ['v3_pool_ticks', key] : null,
    async () => {
      fetchingBlock.current = blockNumber.toString()
      try {
        const label = `[V3_POOL_TICKS] ${key} ${blockNumber?.toString()}`
        SmartRouter.metric(label)
        const poolTicks = await Promise.all(
          pools.map(async ({ token0, token1, fee }) => {
            return getPoolTicks(token0.chainId, getV3PoolAddress(token0, token1, fee)).then((data) => {
              return data.map(
                ({ tick, liquidityNet, liquidityGross }) =>
                  new Tick({ index: Number(tick), liquidityNet, liquidityGross }),
              )
            })
          }),
        )
        SmartRouter.metric(label, poolTicks)
        return {
          pools: pools.map((pool, i) => ({
            ...pool,
            ticks: poolTicks[i],
          })),
          key,
          blockNumber,
        }
      } finally {
        fetchingBlock.current = null
      }
    },
    {
      errorRetryCount: 5,
      revalidateOnFocus: false,
    },
  )

  const { mutate, data, error } = poolsWithTicks
  useEffect(() => {
    // Revalidate pools if block number increases
    if (
      blockNumber &&
      !error &&
      fetchingBlock.current !== blockNumber.toString() &&
      (!data?.blockNumber || blockNumber - data.blockNumber > 5)
    ) {
      mutate()
    }
  }, [blockNumber, mutate, data?.blockNumber, error])

  return poolsWithTicks
}

export function useV3PoolsFromSubgraph(pairs?: Pair[], { key, blockNumber, enabled = true }: V3PoolsHookParams = {}) {
  const fetchingBlock = useRef<string | null>(null)
  const queryEnabled = Boolean(enabled && key && pairs?.length)
  const result = useSWRImmutable<{
    pools: SmartRouter.SubgraphV3Pool[]
    key?: string
    blockNumber?: number
  }>(
    queryEnabled && [key],
    async () => {
      fetchingBlock.current = blockNumber.toString()
      try {
        const pools = await SmartRouter.getV3PoolSubgraph({
          provider: ({ chainId }) => v3Clients[chainId],
          pairs,
        })
        return {
          pools,
          key,
          blockNumber,
        }
      } finally {
        fetchingBlock.current = null
      }
    },
    {
      revalidateOnFocus: false,
      errorRetryCount: 5,
    },
  )

  const { mutate, data, error } = result
  useEffect(() => {
    // Revalidate pools if block number increases
    if (
      queryEnabled &&
      blockNumber &&
      !error &&
      fetchingBlock.current !== blockNumber.toString() &&
      (!data?.blockNumber || blockNumber - data.blockNumber > 5)
    ) {
      mutate()
    }
  }, [blockNumber, mutate, data?.blockNumber, queryEnabled, error])
  return result
}

const V3_POOL_ADDRESS_CACHE = new Map<string, string>()

function getV3PoolAddress(currencyA: Currency, currencyB: Currency, fee: FeeAmount) {
  const [token0, token1] = currencyA.wrapped.sortsBefore(currencyB.wrapped)
    ? [currencyA, currencyB]
    : [currencyB, currencyA]
  const poolAddressCacheKey = [token0.chainId, token0.symbol, token1.symbol, fee].join('_')
  const cached = V3_POOL_ADDRESS_CACHE.get(poolAddressCacheKey)
  if (cached) {
    return cached
  }

  const deployerAddress = DEPLOYER_ADDRESSES[currencyA.chainId as ChainId]
  if (!deployerAddress) {
    return ''
  }
  const address = computePoolAddress({
    deployerAddress,
    tokenA: currencyA.wrapped,
    tokenB: currencyB.wrapped,
    fee,
  })
  V3_POOL_ADDRESS_CACHE.set(poolAddressCacheKey, address)
  return address
}
