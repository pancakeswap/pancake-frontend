import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'
import { useSwapState } from 'state/swap/hooks'
import { useCurrency } from 'hooks/Tokens'
import { Field } from 'state/swap/actions'

export function useIsWrapping() {
  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()

  const { typedValue } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const { wrapType } = useWrapCallback(inputCurrency, outputCurrency, typedValue)

  return wrapType !== WrapType.NOT_APPLICABLE
}
