import { useMemo } from 'react'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import { Field } from 'state/mint/actions'
import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount } from '@pancakeswap/swap-sdk-core'

export function useSupplyingPendingText(
  parsedAmounts: { [field in Field]?: CurrencyAmount<Currency> },
  depositADisabled: boolean,
  depositBDisabled: boolean,
  currencies: { [field in Field]?: Currency },
  outOfRange: boolean,
): string {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const translationData = useMemo(
    () => ({
      amountA: !depositADisabled ? formatCurrencyAmount(parsedAmounts[Field.CURRENCY_A], 4, locale) : '',
      symbolA: !depositADisabled ? currencies[Field.CURRENCY_A]?.symbol : '',
      amountB: !depositBDisabled ? formatCurrencyAmount(parsedAmounts[Field.CURRENCY_B], 4, locale) : '',
      symbolB: !depositBDisabled ? currencies[Field.CURRENCY_B]?.symbol : '',
    }),
    [depositADisabled, depositBDisabled, parsedAmounts, locale, currencies],
  )

  return useMemo(
    () =>
      !outOfRange
        ? t('Supplying %amountA% %symbolA% and %amountB% %symbolB%', translationData)
        : t('Supplying %amountA% %symbolA% %amountB% %symbolB%', translationData),
    [t, outOfRange, translationData],
  )
}
