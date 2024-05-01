import { useAccount } from 'wagmi'

import { useCurrency } from 'hooks/Tokens'
import first from 'lodash/first'
import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'
import { useCurrencyBalances } from 'state/wallet/hooks'

import { InterfaceOrder } from 'views/Swap/utils'
import { useSlippageAdjustedAmounts } from './useSlippageAdjustedAmounts'

export function useCheckInsufficientError(order?: InterfaceOrder | null | undefined) {
  const { address: account } = useAccount()

  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()

  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)

  const slippageAdjustedAmounts = useSlippageAdjustedAmounts(order)

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
