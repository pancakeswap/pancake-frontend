import { FetchLedgerArgs, fetchLedgerInfo, FetchLedgerResult } from '@pancakeswap/awgmi/core'
import { QueryFunction, useQuery } from '@tanstack/react-query'
import { QueryConfig } from '../types'
import { useNetwork } from './useNetwork'

type UseLedgerArgs = Partial<FetchLedgerArgs> & {
  /** Subscribe to changes */
  watch?: boolean
}

export type UseLedgerConfig<TData> = QueryConfig<FetchLedgerResult, Error, TData, QueryKey>

export const queryKey = ({ networkName }: { networkName?: string }) => [{ entity: 'ledger', networkName }] as const

type QueryKey = ReturnType<typeof queryKey>

const queryFn: QueryFunction<FetchLedgerResult, QueryKey> = ({ queryKey: [{ networkName }] }) => {
  return fetchLedgerInfo({ networkName })
}

export function useLedger<TData = unknown>({
  gcTime = 0,
  networkName: networkName_,
  enabled = true,
  staleTime,
  watch = false,
  ...query
}: UseLedgerArgs & UseLedgerConfig<TData> = {}) {
  const { chain } = useNetwork()
  return useQuery({
    ...query,
    queryKey: queryKey({ networkName: networkName_ ?? chain?.network }),
    queryFn,
    gcTime,
    enabled,
    staleTime,
    refetchInterval: watch ? 3_000 : 0,
  })
}
