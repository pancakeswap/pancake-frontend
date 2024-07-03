import { MoveStructId } from '@aptos-labs/ts-sdk'
import { fetchAccountResource, FetchAccountResourceArgs, FetchAccountResourceResult } from '@pancakeswap/awgmi/core'
import { QueryFunction, useQuery } from '@tanstack/react-query'
// import { QueryConfig, QueryFunctionArgs } from '../types'
import { QueryConfig } from '../types'
import { useNetwork } from './useNetwork'

type UseAccountResourceArgs = Partial<FetchAccountResourceArgs> & {
  /** Subscribe to changes */
  watch?: boolean
}

export type UseAccountResourceConfig<TData = unknown> = QueryConfig<
  FetchAccountResourceResult<unknown>,
  Error,
  TData,
  QueryKey
>

export const queryKey = ({
  networkName,
  address,
  resourceType,
}: {
  networkName?: string
  address?: string
  resourceType?: MoveStructId
}) => [{ entity: 'accountResource', networkName, address, resourceType }] as const

type QueryKey = ReturnType<typeof queryKey>

const queryFn: QueryFunction<FetchAccountResourceResult, QueryKey> = ({
  queryKey: [{ networkName, address, resourceType }],
}) => {
  if (!address) throw new Error('address is required')
  if (!resourceType) throw new Error('resourceType is required')
  return fetchAccountResource({ networkName, address, resourceType })
}

export function useAccountResource<TData = unknown>({
  gcTime,
  networkName: networkName_,
  resourceType,
  address,
  enabled = true,
  staleTime = 1_000,
  watch = false,
  select,
  ...query
}: UseAccountResourceArgs & UseAccountResourceConfig<TData> = {}) {
  const { chain } = useNetwork()
  const networkName = networkName_ ?? chain?.network

  return useQuery({
    ...query,
    queryKey: queryKey({ networkName, address, resourceType }),
    queryFn,
    gcTime,
    enabled: Boolean(enabled && address),
    staleTime,
    select,
    refetchInterval: watch ? 3_000 : 0,
  })
}
