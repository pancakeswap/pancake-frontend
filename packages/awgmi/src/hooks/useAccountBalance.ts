import { APTOS_COIN, FetchBalanceArgs } from '@pancakeswap/awgmi/core'
import { QueryConfig } from '../types'

import { useAccountBalances, UseAccountBalancesResult } from './useAccountBalances'

export type UseAccountBalanceArgs = Partial<FetchBalanceArgs> & {
  /** Subscribe to changes */
  watch?: boolean
}

type UseAccountBalances<TData> = QueryConfig<UseAccountBalancesResult, Error, TData>

export function useAccountBalance<TData = unknown>({
  address,
  cacheTime = 1_000,
  networkName,
  enabled = true,
  keepPreviousData,
  staleTime,
  suspense,
  coin,
  watch,
  select,
}: UseAccountBalanceArgs & UseAccountBalances<TData> = {}) {
  return (
    useAccountBalances({
      coinFilter: coin || APTOS_COIN,
      address,
      cacheTime,
      networkName,
      watch,
      enabled: Boolean(enabled && address),
      keepPreviousData,
      staleTime,
      suspense,
      select,
    })?.[0] ?? {}
  )
}
