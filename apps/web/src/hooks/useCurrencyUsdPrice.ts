import { Currency } from '@pancakeswap/sdk'
import { getCurrencyUsdPrice } from '@pancakeswap/utils/getCurrencyPrice'
import { useQuery } from '@tanstack/react-query'

import { SLOW_INTERVAL } from 'config/constants'

type Config = {
  enabled?: boolean
}

export function useCurrencyUsdPrice(currency: Currency | undefined, { enabled = true }: Config = {}) {
  const { data } = useQuery<number>({
    queryKey: ['currencyPrice', currency?.chainId, currency?.wrapped.address],
    queryFn: async () => getCurrencyUsdPrice(currency),
    staleTime: SLOW_INTERVAL,
    refetchInterval: SLOW_INTERVAL,
    enabled: Boolean(enabled && currency),
  })

  return data
}
