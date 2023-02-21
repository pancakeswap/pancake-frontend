import { Currency } from '@pancakeswap/sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'
import { Field } from 'state/swap/actions'

import { parseMMParameter } from '../utils/exchange'
import { useIsMMQuotingPair } from './useIsMMQuotingPair'

export const useMMParam = (
  independentField: Field,
  typedValue: string,
  inputCurrency: Currency | undefined,
  outputCurrency: Currency | undefined,
  isForRFQ?: boolean,
) => {
  const isMMQuotingPair = useIsMMQuotingPair(inputCurrency, outputCurrency)
  const { account, chainId } = useActiveWeb3React()
  return useMemo(
    () =>
      isMMQuotingPair
        ? parseMMParameter(chainId, inputCurrency, outputCurrency, independentField, typedValue, account, isForRFQ)
        : null,
    [chainId, inputCurrency, outputCurrency, independentField, typedValue, account, isMMQuotingPair, isForRFQ],
  )
}
