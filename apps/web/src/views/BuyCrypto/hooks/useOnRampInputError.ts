import { useTranslation } from '@pancakeswap/localization'
import type { Currency } from '@pancakeswap/sdk'
import { useMemo } from 'react'
import formatLocaleNumber from 'utils/formatLocaleNumber'
import { isFiat, type OnRampChainId } from '../constants'
import type { FiatCurrency, OnRampUnit } from '../types'
import { useOnRampLimit } from './useOnRampLimits'

type OnRampLimitsPayload = {
  typedValue: string
  cryptoCurrency: Currency
  fiatCurrency: FiatCurrency
  unit: OnRampUnit
}

export const useLimitsAndInputError = ({ typedValue, cryptoCurrency, fiatCurrency, unit }: OnRampLimitsPayload) => {
  const { t, currentLanguage } = useTranslation()

  const { data: limitsData } = useOnRampLimit({
    fiatCurrency: fiatCurrency?.symbol,
    cryptoCurrency: cryptoCurrency?.symbol,
    network: cryptoCurrency?.chainId as OnRampChainId,
  })

  const inputError = useMemo((): string | undefined => {
    if (!limitsData?.baseCurrency || !limitsData?.quoteCurrency) return undefined

    const quoteCurrency = !isFiat(unit) ? limitsData?.baseCurrency : limitsData?.quoteCurrency
    const baseCurrency = !isFiat(unit) ? limitsData?.quoteCurrency : limitsData?.baseCurrency

    if (Number(typedValue) < baseCurrency.minBuyAmount) {
      return t('The min amount is %minAmount% %fiatCurrency% / %minCryptoAmount% %cryptoCurrency%', {
        minAmount: formatLocaleNumber({
          number: baseCurrency.minBuyAmount,
          locale: currentLanguage.locale,
        }),
        fiatCurrency: baseCurrency.code,
        cryptoCurrency: quoteCurrency.code,
        minCryptoAmount: formatLocaleNumber({ locale: currentLanguage.locale, number: quoteCurrency.minBuyAmount }),
      })
    }
    if (Number(typedValue) > baseCurrency.maxBuyAmount) {
      return t('The max amount is %maxAmount% %fiatCurrency% / %maxCryptoAmount% %cryptoCurrency%', {
        maxAmount: formatLocaleNumber({
          number: baseCurrency.maxBuyAmount,
          locale: currentLanguage.locale,
        }),
        fiatCurrency: baseCurrency.code,
        cryptoCurrency: quoteCurrency.code,
        maxCryptoAmount: formatLocaleNumber({ locale: currentLanguage.locale, number: quoteCurrency.maxBuyAmount }),
      })
    }
    return undefined
  }, [typedValue, t, limitsData?.baseCurrency, limitsData?.quoteCurrency, unit, currentLanguage.locale])

  const amountError = useMemo((): string | undefined => {
    if (!limitsData?.baseCurrency) return undefined
    const baseCurrency = isFiat(unit) ? limitsData?.baseCurrency : limitsData?.quoteCurrency

    if (Number(typedValue) < baseCurrency.minBuyAmount) return t('Amount too low')
    if (Number(typedValue) > baseCurrency.maxBuyAmount) return t('Amount too high')
    return undefined
  }, [typedValue, t, limitsData?.baseCurrency, limitsData?.quoteCurrency, unit])

  return { limitsData, inputError, amountError }
}
