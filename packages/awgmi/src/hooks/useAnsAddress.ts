import { fetchAnsAddress, FetchAnsAddressArgs, FetchAnsAddressResult } from '@pancakeswap/awgmi/core'
import { QueryFunction, useQuery } from '@tanstack/react-query'
import { QueryConfig } from '../types'
import { useNetwork } from './useNetwork'

export type UseAnsNameArgs = Partial<FetchAnsAddressArgs>

export type UseAnsNameConfig<TData> = QueryConfig<FetchAnsAddressResult, Error, TData, QueryKey>

export const queryKey = ({ networkName, name }: { networkName?: string; name?: string }) =>
  [{ entity: 'ansAddress', networkName, name }] as const

type QueryKey = ReturnType<typeof queryKey>

const queryFn: QueryFunction<FetchAnsAddressResult, QueryKey> = ({ queryKey: [{ networkName, name }] }) => {
  if (!name) throw new Error('name is required')
  return fetchAnsAddress({ networkName, name })
}

export function useAnsAddress<TData = unknown>({
  gcTime,
  networkName: networkName_,
  enabled = true,
  name,
  staleTime = 1_000 * 60 * 60 * 24, // 24 hours
  ...query
}: UseAnsNameArgs & UseAnsNameConfig<TData> = {}) {
  const { chain } = useNetwork()
  const networkName = networkName_ ?? chain?.network

  return useQuery({
    ...query,
    gcTime,
    queryKey: queryKey({ networkName, name }),
    queryFn,
    enabled: Boolean(enabled && networkName && name),
    staleTime,
  })
}
