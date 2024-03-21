import { useMemo } from 'react'
import { Field } from 'state/swap/actions'

import { UnsafeCurrency } from 'config/constants/types'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { parseMMParameter } from '../utils/exchange'

export const useMMParam = (
  isMMQuotingPair: boolean,
  independentField: Field,
  typedValue: `${number}`,
  inputCurrency: UnsafeCurrency,
  outputCurrency: UnsafeCurrency,
  isForRFQ?: boolean,
) => {
  const { account, chainId } = useAccountActiveChain()
  return useMemo(
    () =>
      isMMQuotingPair
        ? parseMMParameter(chainId, inputCurrency, outputCurrency, independentField, typedValue, account, isForRFQ)
        : null,
    [chainId, inputCurrency, outputCurrency, independentField, typedValue, account, isMMQuotingPair, isForRFQ],
  )
}
