import invariant from 'tiny-invariant'
import {
  Currency,
  TradeType,
  Percent,
  ZERO,
  CurrencyAmount,
  Fraction,
  ONE,
  Price,
  computePriceImpact,
} from '@pancakeswap/sdk'

import { TradeWithStableSwap } from './types'
import { getMidPrice } from './utils/route'

export const Trade = {
  maximumAmountIn,
  minimumAmountOut,
  executionPrice,
  priceImpact,
}

/**
 * Get the maximum amount in that can be spent via this trade for the given slippage tolerance
 */
function maximumAmountIn<TIn extends Currency, TOut extends Currency, TTradeType extends TradeType>(
  trade: TradeWithStableSwap<TIn, TOut, TTradeType>,
  slippageTolerance: Percent,
): CurrencyAmount<TIn> {
  invariant(!slippageTolerance.lessThan(ZERO), 'SLIPPAGE_TOLERANCE')
  if (trade.tradeType === TradeType.EXACT_INPUT) {
    return trade.inputAmount
  }

  const slippageAdjustedAmountIn = new Fraction(ONE)
    .add(slippageTolerance)
    .multiply(trade.inputAmount.quotient).quotient
  return CurrencyAmount.fromRawAmount(trade.inputAmount.currency, slippageAdjustedAmountIn)
}

/**
 * Get the minimum amount that must be received from this trade for the given slippage tolerance
 */
function minimumAmountOut<TIn extends Currency, TOut extends Currency, TTradeType extends TradeType>(
  trade: TradeWithStableSwap<TIn, TOut, TTradeType>,
  slippageTolerance: Percent,
): CurrencyAmount<TOut> {
  invariant(!slippageTolerance.lessThan(ZERO), 'SLIPPAGE_TOLERANCE')
  if (trade.tradeType === TradeType.EXACT_OUTPUT) {
    return trade.outputAmount
  }
  const slippageAdjustedAmountOut = new Fraction(ONE)
    .add(slippageTolerance)
    .invert()
    .multiply(trade.outputAmount.quotient).quotient
  return CurrencyAmount.fromRawAmount(trade.outputAmount.currency, slippageAdjustedAmountOut)
}

function executionPrice<TIn extends Currency, TOut extends Currency, TTradeType extends TradeType>({
  inputAmount,
  outputAmount,
}: TradeWithStableSwap<TIn, TOut, TTradeType>) {
  return new Price(inputAmount.currency, outputAmount.currency, inputAmount.quotient, outputAmount.quotient)
}

function priceImpact<TIn extends Currency, TOut extends Currency, TTradeType extends TradeType>({
  route,
  inputAmount,
  outputAmount,
}: TradeWithStableSwap<TIn, TOut, TTradeType>) {
  return computePriceImpact(getMidPrice(route), inputAmount, outputAmount)
}
