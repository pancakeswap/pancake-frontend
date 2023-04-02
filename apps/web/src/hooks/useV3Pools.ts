import { ChainId, Currency } from '@pancakeswap/sdk'
import { SmartRouter, V3Pool } from '@pancakeswap/smart-router/evm'
import { computePoolAddress, DEPLOYER_ADDRESSES, FeeAmount, Tick } from '@pancakeswap/v3-sdk'
import { useEffect, useMemo } from 'react'
import useSWR from 'swr'

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
  pools: V3Pool[] | null
  loading: boolean
  syncing: boolean
  blockNumber?: number
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
  } = useV3CandidatePoolsWithoutTicks(currencyA, currencyB, options)

  const {
    data,
    isLoading: ticksLoading,
    isValidating: ticksValidating,
  } = useV3PoolsWithTicks(candidatePoolsWithoutTicks, {
    key,
    blockNumber,
  })

  const candidatePools = data?.pools ?? null

  return {
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
  const { data: poolsFromSubgraphState, isLoading, isValidating } = useV3PoolsFromSubgraph(pairs, { ...options, key })

  const candidatePools = useMemo<V3Pool[] | null>(() => {
    if (!poolsFromSubgraphState?.pools || !currencyA || !currencyB) {
      return null
    }
    return SmartRouter.v3PoolSubgraphSelection(currencyA, currencyB, poolsFromSubgraphState.pools)
  }, [poolsFromSubgraphState, currencyA, currencyB])

  return {
    pools: candidatePools,
    loading: isLoading,
    syncing: isValidating,
    blockNumber: poolsFromSubgraphState?.blockNumber,
    key: poolsFromSubgraphState?.key,
  }
}

export function useV3PoolsWithTicks(
  pools: V3Pool[] | null | undefined,
  { key, blockNumber, enabled }: V3PoolsHookParams = {},
) {
  const poolsWithTicks = useSWR(
    key && pools && enabled ? ['v3_pool_ticks', key] : null,
    async () => {
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
    },
    {
      revalidateOnFocus: false,
    },
  )

  const { mutate } = poolsWithTicks
  useEffect(() => {
    // Revalidate pools if block number increases
    mutate()
  }, [blockNumber, mutate])

  return poolsWithTicks
}

export function useV3PoolsFromSubgraph(pairs?: Pair[], { key, blockNumber, enabled = true }: V3PoolsHookParams = {}) {
  const result = useSWR<{
    pools: SmartRouter.SubgraphV3Pool[]
    key?: string
    blockNumber?: number
  }>(
    enabled && key && pairs?.length && [key],
    async () => {
      const pools = await SmartRouter.getV3PoolSubgraph({
        provider: ({ chainId }) => v3Clients[chainId],
        pairs,
      })
      return {
        pools,
        key,
        blockNumber,
      }
    },
    {
      revalidateOnFocus: false,
    },
  )

  const { mutate } = result
  useEffect(() => {
    // Revalidate pools if block number increases
    mutate()
  }, [blockNumber, mutate])
  return result
}

function getV3PoolAddress(currencyA: Currency, currencyB: Currency, fee: FeeAmount) {
  const deployerAddress = DEPLOYER_ADDRESSES[currencyA.chainId as ChainId]
  if (!deployerAddress) {
    return ''
  }
  return computePoolAddress({
    deployerAddress,
    tokenA: currencyA.wrapped,
    tokenB: currencyB.wrapped,
    fee,
  })
}
