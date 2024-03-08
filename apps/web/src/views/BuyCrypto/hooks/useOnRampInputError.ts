import { useTranslation } from '@pancakeswap/localization'
import type { Currency } from '@pancakeswap/sdk'
import ceil from 'lodash/ceil'
import { useMemo } from 'react'
import formatLocaleNumber from 'utils/formatLocaleNumber'
import { OnRampChainId } from '../constants'
import { useOnRampLimit } from './useOnRampLimits'

function formatNumber(number: number, precision?: number): string {
  if (number >= 10000) {
    const formattedNumber: string = Math.ceil(number / 1000).toString()
    return `${formattedNumber}K`
  }
  return number.toFixed(precision ?? 0)
}

function calculateDefaultAmount(minAmount: number | undefined, currencyCode: string | undefined): number {
  if (!minAmount || !currencyCode) return 0
  return ceil(minAmount * 5)
}

export const useLimitsAndInputError = ({
  typedValue,
  cryptoCurrency,
  fiatCurrency,
}: {
  typedValue: string
  cryptoCurrency: Currency
  fiatCurrency: any
}) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  const {
    data: limitsData,
    isError,
    error,
  } = useOnRampLimit({
    fiatCurrency: fiatCurrency?.symbol as string,
    cryptoCurrency: cryptoCurrency?.symbol,
    network: cryptoCurrency?.chainId as OnRampChainId,
  })
  console.log(cryptoCurrency?.symbol, error)

  const baseCurrency = limitsData?.baseCurrency
  const quoteCurrency = limitsData?.quoteCurrency

  const defaultAmt = useMemo(
    () => calculateDefaultAmount(baseCurrency?.minBuyAmount, baseCurrency?.code).toString(),
    [baseCurrency],
  )

  const commonAmounts = useMemo(() => {
    return [0.33, 0.5, 1.5].map((multiplier) => {
      const commonAmount = calculateDefaultAmount(baseCurrency?.minBuyAmount, baseCurrency?.code) * multiplier

      return formatNumber(commonAmount)
    })
  }, [baseCurrency])

  const inputError = useMemo(() => {
    if (!baseCurrency || !quoteCurrency) return

    if (Number(typedValue) < baseCurrency.minBuyAmount || typedValue === '') {
      // eslint-disable-next-line consistent-return
      return t('The minimum purchasable amount is %minAmount% %fiatCurrency% / %minCryptoAmount% %cryptoCurrency%', {
        minAmount: formatLocaleNumber({
          number: baseCurrency.minBuyAmount,
          locale,
        }),
        fiatCurrency: baseCurrency?.code.toUpperCase(),
        cryptoCurrency: cryptoCurrency.symbol,
        minCryptoAmount: formatLocaleNumber({ locale, number: quoteCurrency.minBuyAmount }),
      })
    }
    if (Number(typedValue) > baseCurrency.maxBuyAmount) {
      // eslint-disable-next-line consistent-return
      return t('The maximum purchasable amount is %maxAmount% %fiatCurrency% / %maxCryptoAmount% %cryptoCurrency%', {
        maxAmount: formatLocaleNumber({
          number: baseCurrency.maxBuyAmount,
          locale,
        }),
        fiatCurrency: baseCurrency?.code.toUpperCase(),
        cryptoCurrency: cryptoCurrency.symbol,
        maxCryptoAmount: formatLocaleNumber({ locale, number: quoteCurrency.maxBuyAmount }),
      })
    }
  }, [typedValue, t, baseCurrency, quoteCurrency, locale, cryptoCurrency])

  return {
    limitsData,
    inputError,
    baseCurrency,
    commonAmounts,
    quoteCurrency,
    defaultAmt,
  }
}
