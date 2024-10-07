import { useMemo } from 'react'

import { Field } from 'state/swap/actions'

import { PriceOrder } from '@pancakeswap/price-api-sdk'
import { useCurrencyBalances } from 'state/wallet/hooks'
import { useAccount } from 'wagmi'
import { useSlippageAdjustedAmounts } from './useSlippageAdjustedAmounts'
import { useSwapCurrency } from './useSwapCurrency'

export function useUserInsufficientBalance(order: PriceOrder | undefined): boolean {
  const [inputCurrency, outputCurrency] = useSwapCurrency()
  const { address: account } = useAccount()
  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    inputCurrency ?? undefined,
    outputCurrency ?? undefined,
  ])
  const slippageAdjustedAmounts = useSlippageAdjustedAmounts(order)
  const isInsufficientBalance = useMemo(() => {
    const currencyBalances = {
      [Field.INPUT]: relevantTokenBalances[0],
      [Field.OUTPUT]: relevantTokenBalances[1],
    }
    if (!account) {
      return false
    }
    const [balanceIn, amountIn] = [
      currencyBalances[Field.INPUT],
      slippageAdjustedAmounts ? slippageAdjustedAmounts[Field.INPUT] : null,
    ]
    if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
      return true
    }
    return false
  }, [account, relevantTokenBalances, slippageAdjustedAmounts])

  return isInsufficientBalance
}
