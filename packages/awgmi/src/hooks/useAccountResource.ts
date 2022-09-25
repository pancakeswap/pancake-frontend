import { fetchAccountResource, FetchAccountResourceArgs, FetchAccountResourceResult } from '@pancakeswap/awgmi/core'

import { QueryConfig, QueryFunctionArgs } from '../types'
import { useQuery } from './query/useQuery'

type UseAccountResourceArgs = Partial<FetchAccountResourceArgs> & {
  /** Subscribe to changes */
  watch?: boolean
}

export type UseAccountResourceConfig<TData> = QueryConfig<FetchAccountResourceResult, Error, TData>

export const queryKey = ({
  networkName,
  address,
  resourceType,
}: {
  networkName?: string
  address?: string
  resourceType?: string
}) => [{ entity: 'accountResource', networkName, address, resourceType }] as const

const queryFn = ({ queryKey: [{ networkName, address, resourceType }] }: QueryFunctionArgs<typeof queryKey>) => {
  if (!address) throw new Error('address is required')
  if (!resourceType) throw new Error('resourceType is required')
  return fetchAccountResource({ networkName, address, resourceType })
}

export function useAccountResource<TData = unknown>({
  cacheTime = 0,
  networkName: _networkName,
  resourceType,
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
}: UseAccountResourceArgs & UseAccountResourceConfig<TData> = {}) {
  return useQuery(queryKey({ networkName: _networkName, address, resourceType }), queryFn, {
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
