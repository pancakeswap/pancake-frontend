import { Currency } from '@pancakeswap/swap-sdk-core'
import { useCurrency } from 'hooks/Tokens'
import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'

export const useSwapCurrencyIds = (): [string | undefined, string | undefined] => {
  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()

  return [inputCurrencyId, outputCurrencyId]
}

export const useSwapCurrency = (): [Currency | undefined, Currency | undefined] => {
  const [inputCurrencyId, outputCurrencyId] = useSwapCurrencyIds()

  const inputCurrency = useCurrency(inputCurrencyId) as Currency
  const outputCurrency = useCurrency(outputCurrencyId) as Currency

  return [inputCurrency, outputCurrency]
}
