import { fetchHealthy, FetchHealthyArgs, FetchHealthyResult } from '@pancakeswap/awgmi/core'
import { QueryFunction, useQuery } from '@tanstack/react-query'
import { QueryConfig } from '../types'
import { useNetwork } from './useNetwork'

type UseLedgerArgs = Partial<FetchHealthyArgs> & {
  /** Subscribe to changes */
  watch?: boolean
}

type QueryKey = ReturnType<typeof queryKey>

export type UseHealthyConfig<TData> = QueryConfig<FetchHealthyResult, Error, TData, QueryKey>

export const queryKey = ({ networkName, durationSecs }: FetchHealthyArgs) =>
  [{ entity: 'healthy', networkName, durationSecs }] as const

const queryFn: QueryFunction<FetchHealthyResult, QueryKey> = ({ queryKey: [{ networkName, durationSecs }] }) => {
  return fetchHealthy({ networkName, durationSecs })
}

export function useHealthy<TData = unknown>({
  gcTime = 0,
  networkName: networkName_,
  durationSecs = 2,
  enabled = true,
  staleTime,
  watch = false,
  ...query
}: UseLedgerArgs & UseHealthyConfig<TData> = {}) {
  const { chain } = useNetwork()
  return useQuery({
    ...query,
    queryKey: queryKey({ networkName: networkName_ ?? chain?.network, durationSecs }),
    queryFn,
    gcTime,
    enabled,
    staleTime,
    refetchInterval: watch ? 3_000 : 0,
  })
}
