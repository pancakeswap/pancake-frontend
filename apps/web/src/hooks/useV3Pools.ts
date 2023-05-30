import { Currency } from '@pancakeswap/sdk'
import { SmartRouter, V3Pool } from '@pancakeswap/smart-router/evm'
import { Tick } from '@pancakeswap/v3-sdk'
import { useEffect, useMemo, useRef } from 'react'
import useSWRImmutable from 'swr/immutable'
import { useQuery } from '@tanstack/react-query'

import { v3Clients } from 'utils/graphql'

import { getPoolTicks } from './v3/useAllV3TicksQuery'

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

  const {
    data,
    refetch,
    isLoading,
    isFetching,
    error: errorMsg,
  } = useQuery({
    queryKey: ['v3_candidate_pools', key],
    queryFn: async () => {
      const pools = await SmartRouter.getV3CandidatePools({
        currencyA,
        currencyB,
        subgraphProvider: ({ chainId }) => v3Clients[chainId],
        blockNumber: options?.blockNumber,
      })
      return {
        key,
        pools,
        blockNumber: options?.blockNumber,
      }
    },
    enabled: Boolean(currencyA && currencyB && key && options?.enabled),
  })

  const error = useMemo(() => errorMsg && new Error(errorMsg as string), [errorMsg])

  return {
    refresh: refetch,
    pools: data?.pools ?? null,
    loading: isLoading,
    syncing: isFetching,
    blockNumber: data?.blockNumber,
    key: data?.key,
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
      if (!pools) {
        throw new Error('Invalid pools to get ticks')
      }
      fetchingBlock.current = blockNumber?.toString()
      try {
        const label = `[V3_POOL_TICKS] ${key} ${blockNumber?.toString()}`
        SmartRouter.metric(label)
        const poolTicks = await Promise.all(
          pools.map(async (pool) => {
            const { token0 } = pool
            return getPoolTicks(token0.chainId, SmartRouter.getPoolAddress(pool)).then((data) => {
              return data.map(
                ({ tick, liquidityNet, liquidityGross }) =>
                  new Tick({ index: Number(tick), liquidityNet, liquidityGross }),
              )
            })
          }),
        )
        SmartRouter.metric(label, poolTicks)
        return {
          pools: pools?.map((pool, i) => ({
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
