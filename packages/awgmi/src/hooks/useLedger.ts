import { FetchLedgerArgs, fetchLedgerInfo, FetchLedgerResult } from '@pancakeswap/awgmi/core'

import { QueryConfig, QueryFunctionArgs } from '../types'
import { useQuery } from './utils/useQuery'

type UseLedgerArgs = Partial<FetchLedgerArgs> & {
  /** Subscribe to changes */
  watch?: boolean
}

export type UseLedgerConfig = QueryConfig<FetchLedgerResult, Error>

export const queryKey = ({ networkName }: { networkName?: string }) => [{ entity: 'ledger', networkName }] as const

const queryFn = ({ queryKey: [{ networkName }] }: QueryFunctionArgs<typeof queryKey>) => {
  return fetchLedgerInfo({ networkName }) as any
}

export function useLedger({
  cacheTime = 0,
  networkName: _networkName,
  enabled = true,
  staleTime,
  suspense,
  watch = false,
  onError,
  onSettled,
  onSuccess,
}: UseLedgerArgs & UseLedgerConfig = {}) {
  return useQuery(queryKey({ networkName: _networkName }), queryFn, {
    cacheTime,
    enabled,
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess,
    refetchInterval: watch ? 2_000 : 0,
  })
}
