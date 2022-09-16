import { fetchAccountResources, FetchAccountResourcesArgs, FetchAccountResourcesResult } from '../../core'

import { QueryConfig, QueryFunctionArgs } from '../types'
import { useQuery } from './query/useQuery'

type UseAccountResourcesArgs = Partial<FetchAccountResourcesArgs> & {
  /** Subscribe to changes */
  watch?: boolean
}

export type UseAccountResourcesConfig = QueryConfig<FetchAccountResourcesResult, Error>

export const queryKey = ({ networkName, address }: { networkName?: string; address?: string }) =>
  [{ entity: 'accountResources', networkName, address }] as const

const queryFn = ({ queryKey: [{ networkName, address }] }: QueryFunctionArgs<typeof queryKey>) => {
  if (!address) throw new Error('address is required')
  return fetchAccountResources({ networkName, address })
}

export function useAccountResources({
  cacheTime = 0,
  networkName: _networkName,
  address,
  enabled = true,
  staleTime,
  suspense,
  watch = false,
  onError,
  onSettled,
  onSuccess,
}: UseAccountResourcesArgs & UseAccountResourcesConfig = {}) {
  return useQuery(queryKey({ networkName: _networkName, address }), queryFn, {
    cacheTime,
    enabled: Boolean(enabled && address),
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess,
    refetchInterval: watch ? 10000 : 0,
  })
}
