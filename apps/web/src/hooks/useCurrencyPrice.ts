import { useQuery } from '@tanstack/react-query'
import { Currency } from '@pancakeswap/sdk'

import { SLOW_INTERVAL } from 'config/constants'
import { getCurrencyPrice } from 'utils/getCurrencyPrice'

type Config = {
  enabled?: boolean
}

export function useCurrencyPrice(currency: Currency | undefined, { enabled = true }: Config = {}) {
  const { data } = useQuery<number>({
    queryKey: ['currencyPrice', currency?.chainId, currency?.wrapped.address],
    queryFn: async () => getCurrencyPrice(currency),
    staleTime: SLOW_INTERVAL,
    refetchInterval: SLOW_INTERVAL,
    enabled: Boolean(enabled && currency),
  })

  return data
}
