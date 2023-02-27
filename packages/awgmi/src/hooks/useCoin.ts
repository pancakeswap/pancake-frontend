import { fetchCoin, FetchCoinArgs, FetchCoinResult } from '@pancakeswap/awgmi/core'

import { QueryConfig, QueryFunctionArgs } from '../types'
import { useQuery } from './utils/useQuery'
import { useNetwork } from './useNetwork'

export type UseCoinArgs = Partial<FetchCoinArgs> & {
  /** Subscribe to changes */
  watch?: boolean
}

export type UseCoinConfig<TData> = QueryConfig<FetchCoinResult, Error, TData>

export const queryKey = ({ coin, networkName }: Partial<UseCoinArgs>) =>
  [{ entity: 'coin', coin, networkName }] as const

const queryFn = ({ queryKey: [{ coin, networkName }] }: QueryFunctionArgs<typeof queryKey>) => {
  if (!coin) throw new Error('coin is required')
  return fetchCoin({ coin, networkName })
}

export function useCoin<TData = FetchCoinResult>({
  cacheTime,
  coin,
  enabled = true,
  initialData,
  networkName: networkName_,
  onError,
  onSettled,
  onSuccess,
  select,
  staleTime = 1_000 * 60 * 60 * 24, // 24 hours
  suspense,
  watch,
}: UseCoinArgs & UseCoinConfig<TData> = {}) {
  const { chain } = useNetwork()

  return useQuery(queryKey({ networkName: networkName_ ?? chain?.network, coin }), queryFn, {
    cacheTime,
    enabled: Boolean(enabled && coin),
    // @ts-ignore
    // FIX types
    initialData,
    select,
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess,
    refetchInterval: watch ? 5_000 : 0,
  })
}
