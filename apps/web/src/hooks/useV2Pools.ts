import { Currency } from '@pancakeswap/sdk'
import { SmartRouter, V2Pool } from '@pancakeswap/smart-router/evm'
import { useMemo, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'

import { infoClientWithChain, v3Clients } from 'utils/graphql'
import { getViemClients } from 'utils/viem'
import { POOLS_FAST_REVALIDATE } from 'config/pools'

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
  refresh: () => void
}

export function useV2CandidatePools(
  currencyA?: Currency,
  currencyB?: Currency,
  options?: V2PoolsHookParams,
): V2PoolsResult {
  const refreshInterval = useMemo(() => {
    const chainId = currencyA?.chainId
    if (!chainId) {
      return 0
    }
    return POOLS_FAST_REVALIDATE[chainId] || 0
  }, [currencyA])

  const key = useMemo(() => {
    if (!currencyA || !currencyB || currencyA.wrapped.equals(currencyB.wrapped)) {
      return ''
    }
    const symbols = currencyA.wrapped.sortsBefore(currencyB.wrapped)
      ? [currencyA.symbol, currencyB.symbol]
      : [currencyB.symbol, currencyA.symbol]
    return [...symbols, currencyA.chainId].join('_')
  }, [currencyA, currencyB])

  const fetchingBlock = useRef<string | undefined>(undefined)
  const queryEnabled = Boolean(options?.enabled && key)

  const result = useQuery<{
    pools: V2Pool[]
    key?: string
    blockNumber?: number
  }>(
    ['V2_Candidate_Pools', key],
    async () => {
      fetchingBlock.current = options?.blockNumber?.toString()
      try {
        const pools = await SmartRouter.getV2CandidatePools({
          currencyA,
          currencyB,
          v2SubgraphProvider: ({ chainId }) => infoClientWithChain(chainId),
          v3SubgraphProvider: ({ chainId }) => (chainId ? v3Clients[chainId] : undefined),
          onChainProvider: getViemClients,
        })
        return {
          pools,
          key,
          blockNumber: options?.blockNumber,
        }
      } finally {
        fetchingBlock.current = undefined
      }
    },
    {
      enabled: Boolean(queryEnabled && key),
      refetchInterval: refreshInterval,
      refetchOnWindowFocus: false,
      retry: 3,
    },
  )

  const { refetch, data, isLoading, isFetching } = result

  return {
    pools: data?.pools ?? null,
    loading: isLoading,
    syncing: isFetching,
    blockNumber: data?.blockNumber,
    refresh: refetch,
  }
}
