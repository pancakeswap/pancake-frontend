import * as React from 'react'
import { FetchBalanceArgs, FetchBalanceResult, fetchBalance } from '@pancakeswap/awgmi/core'

import { QueryConfig, QueryFunctionArgs } from '../types'
import { useQuery } from './query/useQuery'
import { useLedger } from './useLedger'

export type UseBalanceArgs = Partial<FetchBalanceArgs> & {
  /** Subscribe to changes */
  watch?: boolean
}

export type UseBalanceConfig<TData> = QueryConfig<FetchBalanceResult, Error, TData>

export const queryKey = ({
  address,
  networkName,
  coin,
}: Partial<FetchBalanceArgs> & {
  chainId?: number
}) => [{ entity: 'balance', address, networkName, coin }] as const

const queryFn = ({ queryKey: [{ address, networkName, coin }] }: QueryFunctionArgs<typeof queryKey>) => {
  if (!address) throw new Error('address is required')
  return fetchBalance({ address, networkName, coin })
}

export function useBalance<TData = FetchBalanceResult>({
  address,
  cacheTime = 1_000,
  networkName,
  enabled = true,
  keepPreviousData = true,
  staleTime,
  suspense,
  coin,
  watch,
  onError,
  onSettled,
  onSuccess,
  select,
}: UseBalanceArgs & UseBalanceConfig<TData> = {}) {
  const { data } = useLedger({ watch: true, networkName })
  const { ledger_version: version } = data || {}
  const balanceQuery = useQuery(queryKey({ address, networkName, coin }), queryFn, {
    cacheTime,
    enabled: Boolean(enabled && address),
    keepPreviousData,
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess,
    select,
  })

  React.useEffect(() => {
    if (!enabled) return
    if (!watch) return
    if (!version) return
    if (!address) return
    balanceQuery.refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version])

  return balanceQuery
}
