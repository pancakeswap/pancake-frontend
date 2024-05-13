import { useQuery, type QueryFunction } from '@tanstack/react-query'
import { WALLET_API } from 'config/constants/endpoints'
import { useCallback, useMemo } from 'react'
import { createQueryKey } from '../types'

const getFiatUsdRateQueryKey = createQueryKey<'fia-usd-rate', [currencyCode: string]>('fia-usd-rate')
type GetFiatUsdRateKey = ReturnType<typeof getFiatUsdRateQueryKey>

const getFiatPrice: QueryFunction<number, GetFiatUsdRateKey> = async ({ queryKey }) => {
  const [, currencyCode] = queryKey
  if (!currencyCode) {
    throw new Error('Invalid fiat currency code')
  }
  const result = await fetch(`${WALLET_API}/v0/prices/fiat/${currencyCode.toLowerCase()}`).then((res) => res.json())
  if (typeof result !== 'number') {
    throw new Error('Invalid response')
  }
  return result
}

export function useFiatUsdRate({ currencyCode = 'USD' }: { currencyCode: string | undefined }) {
  const queryKey = useMemo(() => getFiatUsdRateQueryKey([currencyCode]), [currencyCode])

  return useQuery({
    gcTime: Number.POSITIVE_INFINITY,
    staleTime: 1000 * 60 * 60 * 1, // 1 hour
    meta: { presist: true as const },
    enabled: currencyCode !== 'USD',
    queryKey,
    refetchInterval: 10_000,
    refetchIntervalInBackground: false,
    queryFn: getFiatPrice,
  })
}

export function useFiatCurrencyAmount({
  currencyCode = 'USD',
  value_,
}: {
  currencyCode: string | undefined
  value_?: number
}) {
  const { data: fiatUsdRate } = useFiatUsdRate({ currencyCode })
  const rate = currencyCode && currencyCode !== 'USD' ? fiatUsdRate : 1

  const convertFiatValue = useCallback(
    (value?: number) => {
      if (typeof rate !== 'number' || typeof value !== 'number') {
        return undefined
      }
      return (value * rate).toFixed(2)
    },
    [rate],
  )

  const fiatValue = useMemo(() => convertFiatValue(value_), [convertFiatValue, value_])

  return {
    convertFiatValue,
    fiatValue,
  }
}
