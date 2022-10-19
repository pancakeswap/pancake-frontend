import { fetchHealthy, FetchHealthyArgs } from '@pancakeswap/awgmi/core'

import { QueryConfig, QueryFunctionArgs } from '../types'
import { useNetwork } from './useNetwork'
import { useQuery } from './utils/useQuery'

type UseLedgerArgs = Partial<FetchHealthyArgs> & {
  /** Subscribe to changes */
  watch?: boolean
}

export type UseHealthyConfig = QueryConfig<string, Error>

export const queryKey = ({ networkName, durationSecs }: FetchHealthyArgs) =>
  [{ entity: 'healthy', networkName, durationSecs }] as const

const queryFn = ({ queryKey: [{ networkName, durationSecs }] }: QueryFunctionArgs<typeof queryKey>) => {
  return fetchHealthy({ networkName, durationSecs })
}

export function useHealthy({
  cacheTime = 0,
  networkName: networkName_,
  durationSecs = 2,
  enabled = true,
  staleTime,
  suspense,
  watch = false,
  onError,
  onSettled,
  onSuccess,
}: UseLedgerArgs & UseHealthyConfig = {}) {
  const { chain } = useNetwork()
  return useQuery(queryKey({ networkName: networkName_ ?? chain?.network, durationSecs }), queryFn, {
    cacheTime,
    enabled,
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess,
    refetchInterval: watch ? 3_000 : 0,
  })
}
