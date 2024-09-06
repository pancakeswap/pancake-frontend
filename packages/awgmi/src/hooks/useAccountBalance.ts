import { APTOS_COIN, FetchBalanceArgs } from '@pancakeswap/awgmi/core'
import { QueryConfig } from '../types'

import { useAccountBalances, UseAccountBalancesQueryResult, UseAccountBalancesResult } from './useAccountBalances'
import { useNetwork } from './useNetwork'
import { UseAccountResourcesConfig } from './useAccountResources'

export type UseAccountBalanceArgs = Partial<FetchBalanceArgs> & {
  /** Subscribe to changes */
  watch?: boolean
  select?: (data: UseAccountBalancesResult) => UseAccountBalancesResult | null | undefined
}

type UseAccountBalances<TData> = Omit<QueryConfig<UseAccountBalancesQueryResult, Error, TData>, 'select'>

export function useAccountBalance<TData = unknown>({
  address,
  gcTime,
  networkName: networkName_,
  enabled = true,
  staleTime,
  coin,
  watch,
  select,
}: UseAccountBalanceArgs & UseAccountBalances<TData> = {}) {
  const { chain } = useNetwork()
  const networkName = networkName_ ?? chain?.network

  const results = useAccountBalances({
    coinFilter: coin || APTOS_COIN,
    address,
    gcTime,
    networkName,
    watch,
    enabled: Boolean(enabled && address),
    staleTime,
    select,
  })

  return results?.[0] ?? {}
}
