import { formatUnits } from '@ethersproject/units'
import { fetchBalance, FetchBalanceArgs, FetchCoinResult } from '@pancakeswap/awgmi/core'

import { QueryConfig } from '../types'
import { useCoin } from './useCoin'
import { useNetwork } from './useNetwork'
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
  networkName: networkName_,
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
  const { chain } = useNetwork()
  const networkName = networkName_ ?? chain?.network
  const { data: coinData } = useCoin({ coin, networkName })

  const balanceQuery = useQuery(
    queryKey({ address, networkName, coin }),
    async ({ queryKey: [{ address: address_, networkName: networkName__, coin: coin_ }] }) => {
      if (!address_) throw new Error('address is required')
      if (!coinData) throw new Error('coin data is missing')
      const balance = await fetchBalance({ address: address_, coin: coin_, networkName: networkName__ })
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
      refetchInterval: watch ? 3_000 : 0,
    },
  )

  return balanceQuery
}
