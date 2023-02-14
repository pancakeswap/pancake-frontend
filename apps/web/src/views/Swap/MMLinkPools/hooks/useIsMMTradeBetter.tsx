import { Currency, Trade, TradeType, ZERO } from '@pancakeswap/sdk'
import { TradeWithStableSwap } from '@pancakeswap/smart-router/evm'
import { useMemo } from 'react'
import { useMMLinkedPoolByDefault } from 'state/user/mmLinkedPool'
import { Field } from 'state/swap/actions'
import { TradeWithMM } from '../types'

interface Options {
  independentField: Field
  trade?: TradeWithStableSwap<Currency, Currency, TradeType> | null
  v2Trade?: Trade<Currency, Currency, TradeType> | null
  tradeWithMM?: TradeWithMM<Currency, Currency, TradeType> | null
  isMMQuotingPair?: boolean
  isExpertMode?: boolean
}

export const useIsTradeWithMMBetter = ({
  independentField,
  trade,
  v2Trade,
  tradeWithMM,
  isMMQuotingPair = false,
  isExpertMode = false,
}: Options) => {
  const [isMMLinkedPoolByDefault] = useMMLinkedPoolByDefault()
  return useMemo(() => {
    const isExactIn = independentField === Field.INPUT
    if (
      !isMMLinkedPoolByDefault ||
      isExpertMode ||
      !isMMQuotingPair ||
      !tradeWithMM ||
      tradeWithMM.inputAmount.equalTo(ZERO) ||
      tradeWithMM.outputAmount.equalTo(ZERO)
    ) {
      return false
    }
    if (!v2Trade && !trade && tradeWithMM) return true // v2 and smart router has not liq but MM provide the deal
    if (!v2Trade?.outputAmount || !v2Trade?.inputAmount) {
      if (tradeWithMM) return true
    }
    return (
      (isExactIn && tradeWithMM.outputAmount.greaterThan(v2Trade?.outputAmount ?? ZERO)) || // exactIn
      (!isExactIn && tradeWithMM.inputAmount.lessThan(v2Trade?.inputAmount ?? ZERO)) // exactOut
    )
  }, [trade, v2Trade, tradeWithMM, isMMQuotingPair, isExpertMode, independentField, isMMLinkedPoolByDefault])
}
