import { Currency } from '@pancakeswap/sdk'
import { SmartRouter, V2Pool } from '@pancakeswap/smart-router/evm'
import { useEffect, useMemo } from 'react'
import useSWR from 'swr'

import { infoClientWithChain } from 'utils/graphql'

type Pair = [Currency, Currency]

export interface V2PoolsHookParams {
  // Used for caching
  key?: string
  blockNumber?: number
  enabled?: boolean
}

export interface V2PoolsResult {
  pools: V2Pool[] | null
  loading: boolean
  syncing: boolean
  blockNumber?: number
}

export function useV2CandidatePools(currencyA?: Currency, currencyB?: Currency, options?: V2PoolsHookParams) {
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
  const { data: poolsFromSubgraphState, isLoading, isValidating } = useV2PoolsFromSubgraph(pairs, { ...options, key })

  const candidatePools = useMemo<V2Pool[] | null>(() => {
    if (!poolsFromSubgraphState?.pools || !currencyA || !currencyB) {
      return null
    }
    return SmartRouter.v2PoolSubgraphSelection(currencyA, currencyB, poolsFromSubgraphState.pools)
  }, [poolsFromSubgraphState, currencyA, currencyB])

  return {
    pools: candidatePools,
    loading: isLoading,
    syncing: isValidating,
    blockNumber: poolsFromSubgraphState?.blockNumber,
    key: poolsFromSubgraphState?.key,
  }
}

export function useV2PoolsFromSubgraph(pairs?: Pair[], { key, blockNumber, enabled = true }: V2PoolsHookParams = {}) {
  const result = useSWR<{
    pools: SmartRouter.SubgraphV2Pool[]
    key?: string
    blockNumber?: number
  }>(
    enabled && key && pairs?.length && ['V2PoolsFromSubgraph', key],
    async () => {
      const pools = await SmartRouter.getV2PoolSubgraph({
        provider: ({ chainId }) => infoClientWithChain(chainId),
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
