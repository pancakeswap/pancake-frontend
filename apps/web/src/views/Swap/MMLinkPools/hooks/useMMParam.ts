import { Currency } from '@pancakeswap/sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'
import { Field } from 'state/swap/actions'

import { parseMMParameter } from '../utils/exchange'

export const useMMParam = (
  isMMQuotingPair: boolean,
  independentField: Field,
  typedValue: string,
  inputCurrency: Currency | undefined,
  outputCurrency: Currency | undefined,
  isForRFQ?: boolean,
) => {
  const { account, chainId } = useActiveWeb3React()
  return useMemo(
    () =>
      isMMQuotingPair
        ? parseMMParameter(chainId, inputCurrency, outputCurrency, independentField, typedValue, account, isForRFQ)
        : null,
    [chainId, inputCurrency, outputCurrency, independentField, typedValue, account, isMMQuotingPair, isForRFQ],
  )
}
