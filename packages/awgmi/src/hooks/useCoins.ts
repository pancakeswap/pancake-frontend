import { fetchCoin, FetchCoinResult } from '@pancakeswap/awgmi/core'
import { useQueries } from '@tanstack/react-query'
import { QueryConfig } from '../types'
import { queryKey as coinQueryKey } from './useCoin'
import { useNetwork } from './useNetwork'
import { queryClientContext as context } from '../context'

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

  const networkName = networkName_ ?? chain?.network

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
        notifyOnChangeProps: ['data', 'error', 'isLoading'] as any, // seems useQueries tracked all properties here, until we figure out what happens, only track 3 major properties here
      }
    }),
  })
}
