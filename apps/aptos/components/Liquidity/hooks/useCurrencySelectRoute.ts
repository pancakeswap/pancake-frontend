import { Currency } from '@pancakeswap/sdk'
import { USDC_DEVNET } from 'config/coins'
import { useCurrency } from 'hooks/Tokens'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useRouter } from 'next/router'
import { createContext, useCallback, useMemo } from 'react'

export function currencyId(currency: Currency): string {
  if (currency?.isNative) return currency.symbol?.toUpperCase()
  if (currency?.isToken) return currency.address
  throw new Error('invalid currency')
}

export interface CurrencySelectorValue {
  currencyA: Currency | undefined
  currencyB: Currency | undefined
}

export const CurrencySelectorContext = createContext<CurrencySelectorValue>({
  currencyA: undefined,
  currencyB: undefined,
})

export function useCurrencySelector(): CurrencySelectorValue {
  const router = useRouter()

  const native = useNativeCurrency()

  const [currencyIdA, currencyIdB] = router.query.currency || [native.address, USDC_DEVNET.address]

  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  return useMemo(
    () => ({
      currencyA,
      currencyB,
    }),
    [currencyA, currencyB],
  )
}

export const useCurrencySelectRoute = () => {
  const native = useNativeCurrency()
  const router = useRouter()
  const [currencyIdA, currencyIdB] = router.query.currency || []

  const handleCurrencyASelect = useCallback(
    (currencyA_: Currency) => {
      const newCurrencyIdA = currencyId(currencyA_)
      if (newCurrencyIdA === currencyIdB) {
        router.replace(`/add/${currencyIdB}/${currencyIdA}`, undefined, { shallow: true })
      } else if (currencyIdB) {
        router.replace(`/add/${newCurrencyIdA}/${currencyIdB}`, undefined, { shallow: true })
      } else {
        router.replace(`/add/${newCurrencyIdA}`, undefined, { shallow: true })
      }
    },
    [currencyIdB, router, currencyIdA],
  )
  const handleCurrencyBSelect = useCallback(
    (currencyB_: Currency) => {
      const newCurrencyIdB = currencyId(currencyB_)
      if (currencyIdA === newCurrencyIdB) {
        if (currencyIdB) {
          router.replace(`/add/${currencyIdB}/${newCurrencyIdB}`, undefined, { shallow: true })
        } else {
          router.replace(`/add/${newCurrencyIdB}`, undefined, { shallow: true })
        }
      } else {
        router.replace(`/add/${currencyIdA || native.symbol}/${newCurrencyIdB}`, undefined, { shallow: true })
      }
    },
    [currencyIdA, router, currencyIdB, native],
  )

  return {
    handleCurrencyASelect,
    handleCurrencyBSelect,
  }
}
