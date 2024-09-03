import { useMemo } from 'react'
import { Field } from 'state/buyCrypto/actions'
import { useBuyCryptoFormState } from 'state/buyCrypto/reducer'
import { fiatCurrencyMap, getOnRampCryptoById, getOnRampFiatById, isFiat, onRampCurrenciesMap } from '../constants'
import type { OnRampUnit } from '../types'

export const useOnRampCurrencyOrder = (unit: OnRampUnit) => {
  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useBuyCryptoFormState()

  const cryptoCurrency = useMemo(() => {
    if (!inputCurrencyId || !outputCurrencyId) return onRampCurrenciesMap.CAKE_56
    const currencyId = isFiat(unit) ? inputCurrencyId : outputCurrencyId
    return getOnRampCryptoById(currencyId)
  }, [inputCurrencyId, outputCurrencyId, unit])

  const fiatCurrency = useMemo(() => {
    if (!inputCurrencyId || !outputCurrencyId) return fiatCurrencyMap.USD
    const currencyId = isFiat(unit) ? outputCurrencyId : inputCurrencyId
    return getOnRampFiatById(currencyId)
  }, [inputCurrencyId, outputCurrencyId, unit])

  const currencyIn = isFiat(unit) ? cryptoCurrency : fiatCurrency
  const currencyOut = isFiat(unit) ? fiatCurrency : cryptoCurrency

  return { cryptoCurrency, fiatCurrency, currencyIn, currencyOut }
}
