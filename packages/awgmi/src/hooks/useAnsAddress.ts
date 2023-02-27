import { fetchAnsAddress, FetchAnsAddressArgs, FetchAnsAddressResult } from '@pancakeswap/awgmi/core'

import { QueryConfig, QueryFunctionArgs } from '../types'
import { useNetwork } from './useNetwork'
import { useQuery } from './utils/useQuery'

export type UseAnsNameArgs = Partial<FetchAnsAddressArgs>

export type UseAnsNameConfig = QueryConfig<FetchAnsAddressResult, Error>

export const queryKey = ({ networkName, name }: { networkName?: string; name?: string }) =>
  [{ entity: 'ansAddress', networkName, name }] as const

const queryFn = ({ queryKey: [{ networkName, name }] }: QueryFunctionArgs<typeof queryKey>) => {
  if (!name) throw new Error('name is required')
  return fetchAnsAddress({ networkName, name })
}

export function useAnsAddress({
  cacheTime,
  networkName: networkName_,
  enabled = true,
  name,
  staleTime = 1_000 * 60 * 60 * 24, // 24 hours
  suspense,
  onError,
  onSettled,
  onSuccess,
}: UseAnsNameArgs & UseAnsNameConfig = {}) {
  const { chain } = useNetwork()
  const networkName = networkName_ ?? chain?.network

  return useQuery(queryKey({ networkName, name }), queryFn, {
    cacheTime,
    enabled: Boolean(enabled && networkName && name),
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess,
  })
}
