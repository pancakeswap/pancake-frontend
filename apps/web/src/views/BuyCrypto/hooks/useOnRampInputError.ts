import { useTranslation } from '@pancakeswap/localization'
import type { Currency } from '@pancakeswap/sdk'
import ceil from 'lodash/ceil'
import { useMemo } from 'react'
import formatLocaleNumber from 'utils/formatLocaleNumber'
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

  const { data: limitsData } = useOnRampLimit({
    fiatCurrency: fiatCurrency?.symbol,
    cryptoCurrency: cryptoCurrency?.symbol,
    network: cryptoCurrency?.chainId === 'bitcoin' ? 0 : cryptoCurrency?.chainId,
  })

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
    if (!typedValue || !baseCurrency || !quoteCurrency) return

    if (Number(typedValue) < baseCurrency.minBuyAmount) {
      // eslint-disable-next-line consistent-return
      return t('Minimum {{fiatCurrency}} {{minAmount}}', {
        minAmount: formatLocaleNumber({
          number: baseCurrency.minBuyAmount,
          locale,
        }),
        fiatCurrency: baseCurrency.code.toUpperCase(),
        cryptoCurrency: quoteCurrency.code,
      })
    }
    if (Number(typedValue) > baseCurrency.maxBuyAmount) {
      // eslint-disable-next-line consistent-return
      return t('Maximum {{fiatCurrency}} {{maxAmount}}', {
        maxAmount: formatLocaleNumber({
          number: baseCurrency.maxBuyAmount,
          locale,
        }),
        fiatCurrency: baseCurrency.code.toUpperCase(),
        cryptoCurrency: quoteCurrency.code,
      })
    }
  }, [typedValue, t, baseCurrency, quoteCurrency, locale])

  return {
    limitsData,
    inputError,
    baseCurrency,
    commonAmounts,
    quoteCurrency,
    defaultAmt,
  }
}
