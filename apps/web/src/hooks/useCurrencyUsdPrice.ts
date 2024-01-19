import { Currency } from '@pancakeswap/sdk'
import { useQuery } from '@tanstack/react-query'

import { SLOW_INTERVAL } from 'config/constants'
import { usdPriceBatcher } from 'utils/batcher'

type Config = {
  enabled?: boolean
}

export function useCurrencyUsdPrice(currency: Currency | undefined | null, { enabled = true }: Config = {}) {
  return useQuery<number>({
    queryKey: ['currencyPrice', currency?.chainId, currency?.wrapped.address],
    queryFn: async () => {
      if (!currency) {
        throw new Error('No currency provided')
      }
      return usdPriceBatcher.fetch(currency)
    },
    staleTime: SLOW_INTERVAL,
    refetchInterval: SLOW_INTERVAL,
    enabled: Boolean(enabled && currency),
  })
}
