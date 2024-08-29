import { useMemo } from 'react'
import { Field } from 'state/buyCrypto/actions'
import { useBuyCryptoFormState } from 'state/buyCrypto/reducer'

export const useIsBtc = () => {
  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useBuyCryptoFormState()

  return useMemo(
    () => Boolean(inputCurrencyId === 'BTC_0' || outputCurrencyId === 'BTC_0'),
    [inputCurrencyId, outputCurrencyId],
  )
}
