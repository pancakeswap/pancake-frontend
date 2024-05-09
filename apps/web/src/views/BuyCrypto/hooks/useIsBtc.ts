import { useMemo } from 'react'
import { Field } from 'state/buyCrypto/actions'
import { useBuyCryptoState } from 'state/buyCrypto/hooks'

export const useIsBtc = () => {
  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useBuyCryptoState()

  return useMemo(
    () => Boolean(inputCurrencyId === 'BTC_0' || outputCurrencyId === 'BTC_0'),
    [inputCurrencyId, outputCurrencyId],
  )
}
