import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'
import { useSwapState } from 'state/swap/hooks'
import { useCurrency } from 'hooks/Tokens'

export function useIsWrapping(inputCurrencyId: string, outputCurrencyId: string) {
  const { typedValue } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const { wrapType } = useWrapCallback(inputCurrency, outputCurrency, typedValue)

  return wrapType !== WrapType.NOT_APPLICABLE
}
