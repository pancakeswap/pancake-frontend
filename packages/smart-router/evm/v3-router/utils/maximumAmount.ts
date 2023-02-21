import { Percent, TradeType, Fraction, ONE, CurrencyAmount } from '@pancakeswap/sdk'

import { Trade } from '../types'

export function maximumAmountIn(trade: Trade<TradeType>, slippage: Percent) {
  if (trade.tradeType === TradeType.EXACT_INPUT) {
    return trade.inputAmount
  }

  const slippageAdjustedAmountIn = new Fraction(ONE).add(slippage).multiply(trade.inputAmount.quotient).quotient
  return CurrencyAmount.fromRawAmount(trade.inputAmount.currency, slippageAdjustedAmountIn)
}

export function minimumAmountOut(trade: Trade<TradeType>, slippage: Percent) {
  if (trade.tradeType === TradeType.EXACT_OUTPUT) {
    return trade.outputAmount
  }
  const slippageAdjustedAmountOut = new Fraction(ONE)
    .add(slippage)
    .invert()
    .multiply(trade.outputAmount.quotient).quotient
  return CurrencyAmount.fromRawAmount(trade.outputAmount.currency, slippageAdjustedAmountOut)
}
