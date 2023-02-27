import { fetchAnsName, FetchAnsNameArgs, FetchAnsNameResult } from '@pancakeswap/awgmi/core'

import { QueryConfig, QueryFunctionArgs } from '../types'
import { useNetwork } from './useNetwork'
import { useQuery } from './utils/useQuery'

export type UseAnsNameArgs = Partial<FetchAnsNameArgs>

export type UseAnsNameConfig = QueryConfig<FetchAnsNameResult, Error>

export const queryKey = ({ networkName, address }: { networkName?: string; address?: string }) =>
  [{ entity: 'ansAddress', networkName, address }] as const

const queryFn = ({ queryKey: [{ networkName, address }] }: QueryFunctionArgs<typeof queryKey>) => {
  if (!address) throw new Error('address is required')
  return fetchAnsName({ networkName, address })
}

export function useAnsName({
  cacheTime,
  networkName: networkName_,
  enabled = true,
  address,
  staleTime = 1_000 * 60 * 60 * 24, // 24 hours
  suspense,
  onError,
  onSettled,
  onSuccess,
}: UseAnsNameArgs & UseAnsNameConfig = {}) {
  const { chain } = useNetwork()
  const networkName = networkName_ ?? chain?.network

  return useQuery(queryKey({ networkName, address }), queryFn, {
    cacheTime,
    enabled: Boolean(enabled && networkName && address),
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess,
  })
}
