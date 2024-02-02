import { fetchCoin, FetchCoinArgs, FetchCoinResult } from '@pancakeswap/awgmi/core'
import { QueryFunction, useQuery } from '@tanstack/react-query'
import { QueryConfig } from '../types'
import { useNetwork } from './useNetwork'

export type UseCoinArgs = Partial<FetchCoinArgs> & {
  /** Subscribe to changes */
  watch?: boolean
}

export type UseCoinConfig<TData> = QueryConfig<FetchCoinResult, Error, TData, QueryKey>

export const queryKey = ({ coin, networkName }: Partial<UseCoinArgs>) =>
  [{ entity: 'coin', coin, networkName }] as const

type QueryKey = ReturnType<typeof queryKey>

const queryFn: QueryFunction<FetchCoinResult, QueryKey> = ({ queryKey: [{ coin, networkName }] }) => {
  if (!coin) throw new Error('coin is required')
  return fetchCoin({ coin, networkName })
}

export function useCoin<TData = FetchCoinResult>({
  gcTime,
  coin,
  enabled = true,
  initialData,
  networkName: networkName_,
  select,
  staleTime = 1_000 * 60 * 60 * 24, // 24 hours
  watch,
  ...query
}: UseCoinArgs & UseCoinConfig<TData> = {}) {
  const { chain } = useNetwork()

  return useQuery({
    ...query,
    queryKey: queryKey({ coin, networkName: networkName_ ?? chain?.network }),
    queryFn,
    gcTime,
    enabled: Boolean(enabled && coin),
    initialData,
    select,
    staleTime,
    refetchInterval: watch ? 5_000 : 0,
  })
}
