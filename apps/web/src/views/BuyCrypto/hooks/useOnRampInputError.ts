import { useTranslation } from '@pancakeswap/localization'
import type { Currency } from '@pancakeswap/sdk'
import ceil from 'lodash/ceil'
import { useMemo } from 'react'
import formatLocaleNumber from 'utils/formatLocaleNumber'
import { OnRampChainId } from '../constants'
import { useOnRampLimit } from './useOnRampLimits'

export function formatNumber(number: number, precision?: number): string {
  if (number >= 10000) {
    const formattedNumber: string = Math.ceil(number / 1000).toString()
    return `${formattedNumber}K`
  }
  return number.toFixed(precision ?? 0)
}

function calculateDefaultAmount(
  minAmount: number | undefined,
  currencyCode: string | undefined,
  isFiatFlow: boolean,
): number {
  if (!minAmount || !currencyCode) return 300
  return !isFiatFlow ? ceil(minAmount * 5) : Number((minAmount * 5).toFixed(3))
}

export const useLimitsAndInputError = ({
  typedValue,
  cryptoCurrency,
  fiatCurrency,
  isFiatFlow,
}: {
  typedValue: string
  cryptoCurrency: Currency
  fiatCurrency: any
  isFiatFlow: boolean
}) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  const { data: limitsData } = useOnRampLimit({
    fiatCurrency: fiatCurrency?.symbol as string,
    cryptoCurrency: cryptoCurrency?.symbol,
    network: cryptoCurrency?.chainId as OnRampChainId,
  })

  const baseCurrency = !isFiatFlow ? limitsData?.baseCurrency : limitsData?.quoteCurrency
  const quoteCurrency = !isFiatFlow ? limitsData?.quoteCurrency : limitsData?.baseCurrency

  const defaultAmt = useMemo(
    () => calculateDefaultAmount(baseCurrency?.minBuyAmount, baseCurrency?.code, isFiatFlow).toString(),
    [baseCurrency, isFiatFlow],
  )

  const inputError = useMemo(() => {
    if (!baseCurrency || !quoteCurrency || !cryptoCurrency) return

    if (Number(typedValue) < baseCurrency.minBuyAmount) {
      // eslint-disable-next-line consistent-return
      return t('The min amount is %minAmount% %fiatCurrency% / %minCryptoAmount% %cryptoCurrency%', {
        minAmount: formatLocaleNumber({
          number: baseCurrency.minBuyAmount,
          locale,
        }),
        fiatCurrency: baseCurrency.code.toUpperCase(),
        cryptoCurrency: cryptoCurrency.symbol.toUpperCase(),
        minCryptoAmount: formatLocaleNumber({ locale, number: quoteCurrency.minBuyAmount }),
      })
    }
    if (Number(typedValue) > baseCurrency.maxBuyAmount) {
      // eslint-disable-next-line consistent-return
      return t('The max amount is %maxAmount% %fiatCurrency% / %maxCryptoAmount% %cryptoCurrency%', {
        maxAmount: formatLocaleNumber({
          number: baseCurrency.maxBuyAmount,
          locale,
        }),
        fiatCurrency: baseCurrency.code.toUpperCase(),
        cryptoCurrency: cryptoCurrency.symbol.toUpperCase(),
        maxCryptoAmount: formatLocaleNumber({ locale, number: quoteCurrency.maxBuyAmount }),
      })
    }
  }, [typedValue, t, baseCurrency, quoteCurrency, locale, cryptoCurrency])

  const amountError = useMemo(() => {
    if (!baseCurrency) return

    if (Number(typedValue) < baseCurrency.minBuyAmount) {
      // eslint-disable-next-line consistent-return
      return t('Amount too low')
    }
    if (Number(typedValue) > baseCurrency.maxBuyAmount) {
      // eslint-disable-next-line consistent-return
      return t('Amount too high')
    }
  }, [typedValue, t, baseCurrency])

  return {
    limitsData,
    inputError,
    baseCurrency,
    quoteCurrency,
    defaultAmt,
    amountError,
  }
}
