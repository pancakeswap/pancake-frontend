import { fetchAnsName, FetchAnsNameArgs, FetchAnsNameResult } from '@pancakeswap/awgmi/core'
import { QueryFunction, useQuery } from '@tanstack/react-query'
import { QueryConfig } from '../types'
import { useNetwork } from './useNetwork'

export type UseAnsNameArgs = Partial<FetchAnsNameArgs>

export type UseAnsNameConfig<TData> = QueryConfig<FetchAnsNameResult, Error, TData, QueryKey>

export const queryKey = ({ networkName, address }: { networkName?: string; address?: string }) =>
  [{ entity: 'ansAddress', networkName, address }] as const

type QueryKey = ReturnType<typeof queryKey>

const queryFn: QueryFunction<FetchAnsNameResult, QueryKey> = ({ queryKey: [{ networkName, address }] }) => {
  if (!address) throw new Error('address is required')
  return fetchAnsName({ networkName, address })
}

export function useAnsName<TData = unknown>({
  gcTime,
  networkName: networkName_,
  enabled = true,
  address,
  staleTime = 1_000 * 60 * 60 * 24, // 24 hours
  ...query
}: UseAnsNameArgs & UseAnsNameConfig<TData> = {}) {
  const { chain } = useNetwork()
  const networkName = networkName_ ?? chain?.network

  return useQuery({
    ...query,
    gcTime,
    queryKey: queryKey({ networkName, address }),
    queryFn,
    enabled: Boolean(enabled && networkName && address),
    staleTime,
  })
}
