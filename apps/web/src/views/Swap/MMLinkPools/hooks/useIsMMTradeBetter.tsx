import { Currency, Trade, TradeType, ZERO } from '@pancakeswap/sdk'
import { LegacyTradeWithStableSwap as TradeWithStableSwap } from '@pancakeswap/smart-router/legacy-router'
import { SmartRouterTrade } from '@pancakeswap/smart-router/evm'
import { useMemo } from 'react'
import { Field } from 'state/swap/actions'
import { TradeWithMM } from '../types'

interface Options {
  independentField: Field
  trade?: TradeWithStableSwap<Currency, Currency, TradeType> | SmartRouterTrade<TradeType> | null
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
  isExpertMode = false,
}: Options) => {
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
        (isExactIn && tradeWithMM.outputAmount.greaterThan(v2Trade?.outputAmount ?? ZERO)) || // exactIn
        (!isExactIn && tradeWithMM.inputAmount.lessThan(v2Trade?.inputAmount ?? ZERO)) // exactOut
      )
    }
    if (!v2Trade && trade) {
      // compare with smart router only
      if (!trade?.outputAmount || !trade?.inputAmount) {
        if (tradeWithMM) return true
      }
      return (
        (isExactIn && tradeWithMM.outputAmount.greaterThan(trade?.outputAmount ?? ZERO)) || // exactIn
        (!isExactIn && tradeWithMM.inputAmount.lessThan(trade?.inputAmount ?? ZERO)) // exactOut
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
