import { Currency, getCurrencyAddress, sortCurrencies } from '@pancakeswap/swap-sdk-core'
import { V4Router } from '@pancakeswap/smart-router'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { POOLS_FAST_REVALIDATE } from 'config/pools'
import { getViemClients } from 'utils/viem'

export type V4PoolsParams = {
  // Used for caching
  key?: string
  blockNumber?: number
  enabled?: boolean
}

export function useV4CandidateClPoolsWithoutTicks(currencyA?: Currency, currencyB?: Currency, options?: V4PoolsParams) {
  const key = useMemo(() => {
    if (
      !currencyA ||
      !currencyB ||
      currencyA.chainId !== currencyB.chainId ||
      currencyA.wrapped.equals(currencyB.wrapped)
    ) {
      return ''
    }
    const [currency0, currency1] = sortCurrencies([currencyA, currencyB])
    return [
      currency0.isNative,
      getCurrencyAddress(currency0),
      currency1.isNative,
      getCurrencyAddress(currency1),
      currency0.chainId,
    ].join('_')
  }, [currencyA, currencyB])

  const refetchInterval = useMemo(() => {
    if (!currencyA?.chainId) {
      return 0
    }
    return POOLS_FAST_REVALIDATE[currencyA.chainId] || 0
  }, [currencyA?.chainId])

  const { data, refetch, isPending, isFetching, error } = useQuery({
    queryKey: ['v4_cl_candidate_pools_without_ticks', key],
    queryFn: async () => {
      const pools = await V4Router.getV4ClCandidatePools({
        currencyA,
        currencyB,
        clientProvider: getViemClients,
      })
      return {
        key,
        pools,
        blockNumber: options?.blockNumber,
      }
    },
    retry: 2,
    staleTime: refetchInterval,
    refetchInterval,
    refetchOnWindowFocus: false,
    enabled: Boolean(currencyA && currencyB && key && options?.enabled),
  })

  return {
    refresh: refetch,
    pools: data?.pools,
    loading: isPending,
    syncing: isFetching,
    blockNumber: data?.blockNumber,
    key: data?.key,
    error,
  }
}
