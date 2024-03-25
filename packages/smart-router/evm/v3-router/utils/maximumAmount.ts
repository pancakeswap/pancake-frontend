import { CurrencyAmount, Fraction, ONE, Percent, TradeType } from '@pancakeswap/sdk'

import { SmartRouterTrade } from '../types'

export function maximumAmountIn(
  trade: Pick<SmartRouterTrade<TradeType>, 'inputAmount' | 'tradeType'>,
  slippage: Percent,
  amountIn = trade.inputAmount,
) {
  if (trade.tradeType === TradeType.EXACT_INPUT) {
    return amountIn
  }

  const slippageAdjustedAmountIn = new Fraction(ONE).add(slippage).multiply(amountIn.quotient).quotient
  return CurrencyAmount.fromRawAmount(amountIn.currency, slippageAdjustedAmountIn)
}

export function minimumAmountOut(
  trade: Pick<SmartRouterTrade<TradeType>, 'outputAmount' | 'tradeType'>,
  slippage: Percent,
  amountOut = trade.outputAmount,
) {
  if (trade.tradeType === TradeType.EXACT_OUTPUT) {
    return amountOut
  }
  const slippageAdjustedAmountOut = new Fraction(ONE).add(slippage).invert().multiply(amountOut.quotient).quotient
  return CurrencyAmount.fromRawAmount(amountOut.currency, slippageAdjustedAmountOut)
}
