import { fetchAccountResources, FetchAccountResourcesArgs, FetchAccountResourcesResult } from '../../core'

import { QueryConfig, QueryFunctionArgs } from '../types'
import { useQuery } from './query/useQuery'

type UseAccountResourcesArgs = Partial<FetchAccountResourcesArgs> & {
  /** Subscribe to changes */
  watch?: boolean
}

export type UseAccountResourcesConfig<TData = unknown> = QueryConfig<FetchAccountResourcesResult, Error, TData>

export const queryKey = ({ networkName, address }: { networkName?: string; address?: string }) =>
  [{ entity: 'accountResources', networkName, address }] as const

const queryFn = ({ queryKey: [{ networkName, address }] }: QueryFunctionArgs<typeof queryKey>) => {
  if (!address) throw new Error('address is required')
  return fetchAccountResources({ networkName, address })
}

export function useAccountResources<TData = unknown>({
  cacheTime = 0,
  networkName: _networkName,
  keepPreviousData = true,
  address,
  enabled = true,
  staleTime,
  suspense,
  watch = false,
  onError,
  onSettled,
  onSuccess,
  select,
}: UseAccountResourcesArgs & UseAccountResourcesConfig<TData> = {}) {
  return useQuery(queryKey({ networkName: _networkName, address }), queryFn, {
    cacheTime,
    enabled: Boolean(enabled && address),
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess,
    select,
    keepPreviousData,
    refetchInterval: watch ? 10000 : 0,
  })
}
