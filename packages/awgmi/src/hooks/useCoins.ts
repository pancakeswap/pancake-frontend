import { fetchCoin, FetchCoinResult } from '@pancakeswap/awgmi/core'
import { useMemo } from 'react'
import { QueryConfig } from '../types'
import { queryKey as coinQueryKey } from './useCoin'
import { useNetwork } from './useNetwork'
import { useQueries } from './utils/useQueries'

export type UseCoinsArgs = {
  networkName?: string
  coins: string[]
}

export type UseCoinsConfig<TData> = QueryConfig<FetchCoinResult, Error, TData>

export function useCoins<TData = unknown>({
  coins,
  networkName: networkName_,
  select,
  cacheTime,
  enabled = true,
  staleTime = 1_000 * 60 * 60 * 24, // 24 hours
  suspense,
  onError,
  onSettled,
  onSuccess,
}: UseCoinsArgs & UseCoinsConfig<TData>) {
  const { chain } = useNetwork()

  const networkName = chain?.network ?? networkName_

  const queries = useMemo(
    () => ({
      queries: coins.map((coin) => {
        return {
          cacheTime,
          enabled,
          onError,
          onSettled,
          onSuccess,
          queryFn: () => fetchCoin({ coin, networkName }),
          queryKey: coinQueryKey({ coin, networkName }),
          select,
          staleTime,
          suspense,
        }
      }),
    }),
    [cacheTime, coins, enabled, networkName, onError, onSettled, onSuccess, select, staleTime, suspense],
  )

  return useQueries(queries)
}
