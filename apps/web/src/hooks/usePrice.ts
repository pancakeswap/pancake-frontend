import { useQuery } from '@tanstack/react-query'

interface UsePriceParameters {
  currencyA: string

  /** Default: USDT */
  currencyB?: string

  /** Default: 10 seconds */
  pollingInterval?: number
}

interface PriceResponse {
  price: number
}

const PRICE_API = '/api/price'

export const usePrice = ({ currencyA, currencyB = 'USDT', pollingInterval = 10 }: UsePriceParameters) => {
  return useQuery<PriceResponse>({
    queryKey: ['price', currencyA, currencyB],
    queryFn: async () => fetch(`${PRICE_API}/?currencyA=${currencyA}&currencyB=${currencyB}`).then((res) => res.json()),
    refetchInterval: pollingInterval * 1000,
    retry: 2,
    initialData: {
      price: 0,
    },
  })
}
