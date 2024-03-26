import { SmartRouterTrade } from '@pancakeswap/smart-router'
import { TradeType } from '@pancakeswap/swap-sdk-core'
import { useAccount } from 'wagmi'

import { useCurrency } from 'hooks/Tokens'
import first from 'lodash/first'
import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'
import { useCurrencyBalances } from 'state/wallet/hooks'

import { useSlippageAdjustedAmounts } from './useSlippageAdjustedAmounts'

export function useCheckInsufficientError(
  trade?: Pick<SmartRouterTrade<TradeType>, 'inputAmount' | 'outputAmount' | 'tradeType'>,
) {
  const { address: account } = useAccount()

  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()

  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)

  const slippageAdjustedAmounts = useSlippageAdjustedAmounts(trade)

  const currencyBalances = useCurrencyBalances(account ?? undefined, [
    inputCurrency ?? undefined,
    outputCurrency ?? undefined,
  ])

  const [balanceIn, amountIn] = [
    first(currencyBalances),
    slippageAdjustedAmounts ? slippageAdjustedAmounts[Field.INPUT] : null,
  ]

  return balanceIn && amountIn && balanceIn.lessThan(amountIn) ? inputCurrency : undefined
}
