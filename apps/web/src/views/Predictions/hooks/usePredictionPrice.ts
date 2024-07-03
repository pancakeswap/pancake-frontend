import { useQuery } from '@tanstack/react-query'
import { FAST_INTERVAL } from 'config/constants'
import { PREDICTION_PRICE_API } from 'config/constants/endpoints'
import { PriceApiWhitelistedCurrency } from 'config/constants/prediction/price'

interface UsePredictionPriceParameters {
  /** Default: ETH */
  currencyA?: PriceApiWhitelistedCurrency | (string & NonNullable<unknown>)

  /** Default: USDT */
  currencyB?: PriceApiWhitelistedCurrency | (string & NonNullable<unknown>)

  /** Default: 10,000 milliseconds */
  pollingInterval?: number

  enabled?: boolean
}

interface PriceResponse {
  price: number

  currencyA: PriceApiWhitelistedCurrency | (string & NonNullable<unknown>)
  currencyB: PriceApiWhitelistedCurrency | (string & NonNullable<unknown>)
}

export const usePredictionPrice = ({
  currencyA = 'ETH',
  currencyB = 'USDT',
  pollingInterval = FAST_INTERVAL,
  enabled = true,
}: UsePredictionPriceParameters = {}) => {
  return useQuery<PriceResponse>({
    queryKey: ['price', currencyA, currencyB],
    queryFn: async () =>
      fetch(`${PREDICTION_PRICE_API}/?currencyA=${currencyA}&currencyB=${currencyB}`).then((res) => res.json()),
    refetchInterval: pollingInterval,
    retry: 2,
    initialData: {
      price: 0,
      currencyA,
      currencyB,
    },
    enabled,
  })
}
