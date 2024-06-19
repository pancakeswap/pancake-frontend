import { useQuery } from '@tanstack/react-query'
import { FAST_INTERVAL } from 'config/constants'

interface UsePredictionPriceParameters {
  /** Default: ETH */
  currencyA?: string

  /** Default: USDT */
  currencyB?: string

  /** Default: 10,000 milliseconds */
  pollingInterval?: number

  enabled?: boolean
}

interface PriceResponse {
  price: number

  currencyA: string
  currencyB: string
}

const PRICE_API = '/api/prediction/price'

export const usePredictionPrice = ({
  currencyA = 'ETH',
  currencyB = 'USDT',
  pollingInterval = FAST_INTERVAL,
  enabled = true,
}: UsePredictionPriceParameters = {}) => {
  return useQuery<PriceResponse>({
    queryKey: ['price', currencyA, currencyB],
    queryFn: async () => fetch(`${PRICE_API}/?currencyA=${currencyA}&currencyB=${currencyB}`).then((res) => res.json()),
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
