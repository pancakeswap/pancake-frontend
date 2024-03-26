import { Currency, Trade, TradeType, ZERO } from '@pancakeswap/sdk'
import { SmartRouterTrade } from '@pancakeswap/smart-router'
import { useMemo } from 'react'
import { Field } from 'state/swap/actions'

interface Options<T> {
  independentField: Field
  trade?: T | null
  v2Trade?: Pick<Trade<Currency, Currency, TradeType>, 'inputAmount' | 'outputAmount'> | null
  tradeWithMM?: SmartRouterTrade<TradeType> | null
  isMMQuotingPair?: boolean
  isExpertMode?: boolean
}

export const useIsTradeWithMMBetter = <T extends Pick<SmartRouterTrade<TradeType>, 'inputAmount' | 'outputAmount'>>({
  independentField,
  trade,
  v2Trade,
  tradeWithMM,
  isExpertMode = false,
}: Options<T>) => {
  return useMemo(() => {
    const isExactIn = independentField === Field.INPUT
    if (
      isExpertMode ||
      !tradeWithMM ||
      tradeWithMM.inputAmount.equalTo(ZERO) ||
      tradeWithMM.outputAmount.equalTo(ZERO)
    ) {
      return false
    }
    if (!v2Trade && !trade && tradeWithMM) return true // v2 and smart router has not liq but MM provide the deal
    if (v2Trade && !trade) {
      // compare with v2 only
      if (!v2Trade?.outputAmount || !v2Trade?.inputAmount) {
        if (tradeWithMM) return true
      }
      return (
        // exactIn
        (isExactIn && tradeWithMM.outputAmount.greaterThan(v2Trade?.outputAmount ?? ZERO)) ||
        // exactOut
        (!isExactIn && tradeWithMM.inputAmount.lessThan(v2Trade?.inputAmount ?? ZERO))
      )
    }
    if (!v2Trade && trade) {
      // compare with smart router only
      if (!trade?.outputAmount || !trade?.inputAmount) {
        if (tradeWithMM) return true
      }
      return (
        // exactIn
        (isExactIn && tradeWithMM.outputAmount.greaterThan(trade?.outputAmount ?? ZERO)) ||
        // exactOut
        (!isExactIn && tradeWithMM.inputAmount.lessThan(trade?.inputAmount ?? ZERO))
      )
    }
    // compare with smart router and v2 at same time
    return (
      // exactIn
      (isExactIn &&
        tradeWithMM.outputAmount.greaterThan(trade?.outputAmount ?? ZERO) &&
        tradeWithMM.outputAmount.greaterThan(v2Trade?.outputAmount ?? ZERO)) ||
      // exactOut
      (!isExactIn &&
        tradeWithMM.inputAmount.lessThan(trade?.inputAmount ?? ZERO) &&
        tradeWithMM.inputAmount.lessThan(v2Trade?.inputAmount ?? ZERO))
    )
  }, [trade, v2Trade, tradeWithMM, isExpertMode, independentField])
}
