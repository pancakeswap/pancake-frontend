import { fetchAccountResource, FetchAccountResourceArgs, FetchAccountResourceResult } from '@pancakeswap/awgmi/core'

import { QueryConfig, QueryFunctionArgs } from '../types'
import { useNetwork } from './useNetwork'
import { useQuery } from './utils/useQuery'

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
  cacheTime,
  networkName: networkName_,
  resourceType,
  keepPreviousData,
  address,
  enabled = true,
  staleTime = 1_000,
  suspense,
  watch = false,
  onError,
  onSettled,
  onSuccess,
  select,
}: UseAccountResourceArgs & UseAccountResourceConfig<TData> = {}) {
  const { chain } = useNetwork()
  const networkName = networkName_ ?? chain?.network

  return useQuery(queryKey({ networkName, address, resourceType }), queryFn, {
    cacheTime,
    enabled: Boolean(enabled && address),
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess,
    select,
    keepPreviousData,
    refetchInterval: watch ? 3_000 : 0,
  })
}
