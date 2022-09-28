import { useQueries } from '@tanstack/react-query'
import { fetchCoin, FetchCoinResult } from '@pancakeswap/awgmi/core'
import { queryClientContext as context } from '../context'
import { QueryConfig } from '../types'
import { queryKey as coinQueryKey } from './useCoin'
import { useNetwork } from './useNetwork'

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

  return useQueries({
    context,
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
  })
}
