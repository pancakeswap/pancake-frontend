import { fetchAccountResources, FetchAccountResourcesArgs, FetchAccountResourcesResult } from '@pancakeswap/awgmi/core'

import { QueryFunction, useQuery } from '@tanstack/react-query'
import { QueryConfig } from '../types'
import { useNetwork } from './useNetwork'

export type UseAccountResourcesArgs = Partial<FetchAccountResourcesArgs> & {
  /** Subscribe to changes */
  watch?: boolean
}

export type UseAccountResourcesConfig<TData = unknown> = QueryConfig<
  FetchAccountResourcesResult,
  Error,
  TData,
  QueryKey
>

export const queryKey = ({
  entity,
  networkName,
  address,
}: {
  entity?: string
  networkName?: string
  address?: string
}) => [{ entity, networkName, address }] as const

type QueryKey = ReturnType<typeof queryKey>

const queryFn: QueryFunction<FetchAccountResourcesResult, QueryKey> = ({ queryKey: [{ networkName, address }] }) => {
  if (!address) throw new Error('address is required')
  return fetchAccountResources({ networkName, address })
}

export function useAccountResources<TData = unknown>({
  gcTime,
  networkName: networkName_,
  placeholderData,
  address,
  enabled = true,
  staleTime,
  watch = false,
  initialData,
  select,
  ...query
}: UseAccountResourcesArgs & UseAccountResourcesConfig<TData> = {}) {
  const { chain } = useNetwork()
  const networkName = networkName_ ?? chain?.network

  return useQuery({
    ...query,
    queryKey: queryKey({ entity: 'accountResources', networkName, address }),
    queryFn,
    initialData,
    gcTime,
    enabled: Boolean(enabled && address),
    staleTime,
    select,
    placeholderData,
    refetchInterval: (data) => {
      if (!data) return 6_000
      return watch ? 3_000 : 0
    },
  })
}
