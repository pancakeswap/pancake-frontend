import { APTOS_COIN, FetchBalanceArgs } from '@pancakeswap/awgmi/core'
import { QueryConfig } from '../types'

import { useAccountBalances, UseAccountBalancesResult } from './useAccountBalances'
import { useNetwork } from './useNetwork'

export type UseAccountBalanceArgs = Partial<FetchBalanceArgs> & {
  /** Subscribe to changes */
  watch?: boolean
}

type UseAccountBalances<TData> = QueryConfig<UseAccountBalancesResult, Error, TData>

export function useAccountBalance<TData = unknown>({
  address,
  cacheTime,
  networkName: networkName_,
  enabled = true,
  keepPreviousData,
  staleTime,
  suspense,
  coin,
  watch,
  select,
}: UseAccountBalanceArgs & UseAccountBalances<TData> = {}) {
  const { chain } = useNetwork()
  const networkName = networkName_ ?? chain?.network

  const results = useAccountBalances({
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
  })

  return results?.[0] ?? {}
}
