import { Currency } from '@pancakeswap/sdk'
import { SmartRouter, V2Pool } from '@pancakeswap/smart-router/evm'
import { useEffect, useMemo, useRef } from 'react'
import useSWR from 'swr'

import { infoClientWithChain, v3Clients } from 'utils/graphql'
import { getViemClients } from 'utils/viem'

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
  const key = useMemo(() => {
    if (!currencyA || !currencyB || currencyA.wrapped.equals(currencyB.wrapped)) {
      return ''
    }
    const symbols = currencyA.wrapped.sortsBefore(currencyB.wrapped)
      ? [currencyA.symbol, currencyB.symbol]
      : [currencyB.symbol, currencyA.symbol]
    return [...symbols, currencyA.chainId].join('_')
  }, [currencyA, currencyB])

  const fetchingBlock = useRef<string | null>(null)
  const queryEnabled = Boolean(options?.enabled && key)
  const result = useSWR<{
    pools: V2Pool[]
    key?: string
    blockNumber?: number
  }>(
    queryEnabled && key && ['V2_Candidate_Pools', key],
    async () => {
      fetchingBlock.current = options?.blockNumber?.toString()
      try {
        const pools = await SmartRouter.getV2CandidatePools({
          currencyA,
          currencyB,
          v2SubgraphProvider: ({ chainId }) => infoClientWithChain(chainId),
          v3SubgraphProvider: ({ chainId }) => v3Clients[chainId],
          onChainProvider: getViemClients,
        })
        return {
          pools,
          key,
          blockNumber: options?.blockNumber,
        }
      } finally {
        fetchingBlock.current = null
      }
    },
    {
      revalidateOnFocus: false,
    },
  )

  const { mutate, data, isLoading, isValidating } = result
  useEffect(() => {
    // Revalidate pools if block number increases
    if (
      queryEnabled &&
      options?.blockNumber &&
      fetchingBlock.current !== options.blockNumber.toString() &&
      (!data?.blockNumber || options.blockNumber > data.blockNumber)
    ) {
      mutate()
    }
  }, [options?.blockNumber, mutate, data?.blockNumber, queryEnabled])

  return {
    pools: data?.pools ?? null,
    loading: isLoading,
    syncing: isValidating,
    blockNumber: data?.blockNumber,
    refresh: mutate,
  }
}
