import { formatUnits } from '@ethersproject/units'
import { fetchBalance, FetchBalanceArgs, FetchCoinResult } from '@pancakeswap/awgmi/core'
import * as React from 'react'

import { QueryConfig } from '../types'
import { useCoin } from './useCoin'
import { useLedger } from './useLedger'
import { useQuery } from './utils/useQuery'

export type UseBalanceArgs = Partial<FetchBalanceArgs> & {
  /** Subscribe to changes */
  watch?: boolean
}

type UseBalanceResult = FetchCoinResult & { formatted: string; value: string }

export type UseBalanceConfig<TData> = QueryConfig<UseBalanceResult, Error, TData>

export const queryKey = ({ address, networkName, coin }: Partial<FetchBalanceArgs>) =>
  [{ entity: 'balance', address, networkName, coin }] as const

export function useBalance<TData = UseBalanceResult>({
  address,
  cacheTime = 1_000,
  networkName,
  enabled = true,
  keepPreviousData,
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

  const { data: coinData } = useCoin({ coin, networkName })

  const balanceQuery = useQuery(
    queryKey({ address, networkName, coin }),
    async ({ queryKey: [{ address: address_, networkName: networkName_, coin: coin_ }] }) => {
      if (!address_) throw new Error('address is required')
      if (!coinData) throw new Error('coin data is missing')
      const balance = await fetchBalance({ address: address_, coin: coin_, networkName: networkName_ })
      return {
        ...coinData,
        value: balance.value,
        formatted: formatUnits(balance.value ?? '0', coinData.decimals),
      }
    },
    {
      cacheTime,
      enabled: Boolean(enabled && address && coinData),
      keepPreviousData,
      staleTime,
      suspense,
      onError,
      onSettled,
      onSuccess,
      select,
    },
  )

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
