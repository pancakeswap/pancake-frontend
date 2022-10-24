import { FetchLedgerArgs, fetchLedgerInfo, FetchLedgerResult } from '@pancakeswap/awgmi/core'

import { QueryConfig, QueryFunctionArgs } from '../types'
import { useNetwork } from './useNetwork'
import { useQuery } from './utils/useQuery'

type UseLedgerArgs = Partial<FetchLedgerArgs> & {
  /** Subscribe to changes */
  watch?: boolean
}

export type UseLedgerConfig<TData> = QueryConfig<FetchLedgerResult, Error, TData>

export const queryKey = ({ networkName }: { networkName?: string }) => [{ entity: 'ledger', networkName }] as const

const queryFn = ({ queryKey: [{ networkName }] }: QueryFunctionArgs<typeof queryKey>) => {
  return fetchLedgerInfo({ networkName }) as any
}

export function useLedger<TData>({
  cacheTime = 0,
  networkName: networkName_,
  enabled = true,
  staleTime,
  suspense,
  watch = false,
  onError,
  onSettled,
  onSuccess,
}: UseLedgerArgs & UseLedgerConfig<TData> = {}) {
  const { chain } = useNetwork()
  return useQuery(queryKey({ networkName: networkName_ ?? chain?.network }), queryFn, {
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
