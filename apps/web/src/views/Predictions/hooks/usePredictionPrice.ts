import { useQuery } from '@tanstack/react-query'
import { BINANCE_DATA_API, PREDICTION_PRICE_API } from 'config/constants/endpoints'
import { PriceApiWhitelistedCurrency } from 'config/constants/prediction/price'
import { useConfig } from '../context/ConfigProvider'

interface UsePredictionPriceParameters {
  /** Default: ETH */
  currencyA?: PriceApiWhitelistedCurrency | (string & NonNullable<unknown>)

  /** Default: USDT */
  currencyB?: PriceApiWhitelistedCurrency | (string & NonNullable<unknown>)

  /** Default: 5,000 milliseconds */
  pollingInterval?: number

  enabled?: boolean
}

interface PriceResponse {
  price: number

  currencyA: PriceApiWhitelistedCurrency | (string & NonNullable<unknown>)
  currencyB: PriceApiWhitelistedCurrency | (string & NonNullable<unknown>)
}

const DEFAULT_CURRENCY_A: PriceApiWhitelistedCurrency = 'ETH'
const DEFAULT_CURRENCY_B: PriceApiWhitelistedCurrency = 'USDT'
const DEFAULT_POLLING_INTERVAL = 5_000

export const usePredictionPrice = ({
  currencyA = DEFAULT_CURRENCY_A,
  currencyB = DEFAULT_CURRENCY_B,
  pollingInterval = DEFAULT_POLLING_INTERVAL,
  enabled = true,
}: UsePredictionPriceParameters = {}) => {
  const config = useConfig()

  return useQuery<PriceResponse>({
    queryKey: ['price', currencyA, currencyB],
    queryFn: async () => {
      return config?.ai?.useAlternateSource?.current
        ? fetch(`${BINANCE_DATA_API}/v3/ticker/price?symbol=${currencyA}${currencyB}`)
            .then((res) => res.json())
            .then((result) => ({
              price: parseFloat(result.price),
              currencyA,
              currencyB,
            }))
        : fetch(`${PREDICTION_PRICE_API}?currencyA=${currencyA}&currencyB=${currencyB}`).then((res) => res.json())
    },
    refetchInterval: () => (config?.ai?.useAlternateSource?.current ? false : pollingInterval),
    retry: 2,
    initialData: {
      price: 0,
      currencyA,
      currencyB,
    },
    enabled,
  })
}
