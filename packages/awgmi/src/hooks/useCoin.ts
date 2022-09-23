import { fetchCoin, FetchCoinArgs, FetchCoinResult } from '../../core'

import { QueryConfig, QueryFunctionArgs } from '../types'
import { useQuery } from './query/useQuery'
import { useNetwork } from './useNetwork'

export type UseCoinArgs = Partial<FetchCoinArgs>

export type UseCoinConfig<TData> = QueryConfig<FetchCoinResult, Error, TData>

export const queryKey = ({ coin, networkName }: Partial<UseCoinArgs>) =>
  [{ entity: 'coin', coin, networkName }] as const

const queryFn = ({ queryKey: [{ coin, networkName }] }: QueryFunctionArgs<typeof queryKey>) => {
  if (!coin) throw new Error('coin is required')
  return fetchCoin({ coin, networkName })
}

export function useCoin<TData = FetchCoinResult>({
  coin,
  networkName: networkName_,
  select,
  cacheTime,
  enabled = true,
  staleTime = 1_000 * 60 * 60 * 24, // 24 hours
  suspense,
  onError,
  onSettled,
  onSuccess,
}: UseCoinArgs & UseCoinConfig<TData> = {}) {
  const { chain } = useNetwork()

  return useQuery(queryKey({ networkName: chain?.network ?? networkName_, coin }), queryFn, {
    cacheTime,
    enabled: Boolean(enabled && coin),
    select,
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess,
  })
}
