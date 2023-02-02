import { Currency, Trade, TradeType, ZERO } from '@pancakeswap/sdk'
import { TradeWithStableSwap } from '@pancakeswap/smart-router/evm'
import { TradeWithMM } from '../types'

interface Options {
  trade?: TradeWithStableSwap<Currency, Currency, TradeType> | null
  v2Trade?: Trade<Currency, Currency, TradeType> | null
  tradeWithMM?: TradeWithMM<Currency, Currency, TradeType> | null
}

export const useIsTradeWithMMBetter = ({ trade, v2Trade, tradeWithMM }: Options) => {
  if (!tradeWithMM || tradeWithMM.inputAmount.equalTo(ZERO) || tradeWithMM.outputAmount.equalTo(ZERO)) {
    return false
  }
  if (!v2Trade && !trade && tradeWithMM) return true // v2 and smart router has not liq but MM provide the deal
  return (
    tradeWithMM.outputAmount.greaterThan(v2Trade.outputAmount) || // exactIn
    (tradeWithMM.outputAmount.equalTo(v2Trade.outputAmount) && tradeWithMM.inputAmount.lessThan(v2Trade.outputAmount)) // exactOut
  )
}
