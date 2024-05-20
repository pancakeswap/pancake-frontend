import { useMemo } from 'react'
import { Field } from 'state/buyCrypto/actions'
import { useBuyCryptoState } from 'state/buyCrypto/hooks'
import { fiatCurrencyMap, getOnRampCryptoById, getOnRampFiatById, isFiat, onRampCurrenciesMap } from '../constants'
import type { OnRampUnit } from '../types'

export const useOnRampCurrencyOrder = (unit: OnRampUnit) => {
  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useBuyCryptoState()

  const cryptoCurrency = useMemo(() => {
    if (!inputCurrencyId || !outputCurrencyId) return onRampCurrenciesMap.BNB_56
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
