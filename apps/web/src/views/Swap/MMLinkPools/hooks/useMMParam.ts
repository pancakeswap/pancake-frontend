import { Currency } from '@pancakeswap/sdk'
import { useMemo } from 'react'
import { Field } from 'state/swap/actions'

import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { parseMMParameter } from '../utils/exchange'

export const useMMParam = (
  isMMQuotingPair: boolean,
  independentField: Field,
  typedValue: `${number}`,
  inputCurrency: Currency | undefined,
  outputCurrency: Currency | undefined,
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
