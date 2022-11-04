import { BestTradeOptions, Currency, CurrencyAmount, Pair, Trade, TradeType } from '@pancakeswap/sdk'
import { BETTER_TRADE_LESS_HOPS_THRESHOLD } from './constants'

import { isTradeBetter } from './utils/trade'

export async function getBestTradeFromV2<TInput extends Currency, TOutput extends Currency>(
  amountIn: CurrencyAmount<TInput>,
  output: TOutput,
  options: BestTradeOptions = {},
): Promise<Trade<TInput, TOutput, TradeType> | null> {
  const { maxHops = 3 } = options
  // TODO implementation
  const allowedPairs: Pair[] = []

  if (maxHops === 1) {
    return Trade.bestTradeExactIn(allowedPairs, amountIn, output, options)[0] ?? null
  }

  // search through trades with varying hops, find best trade out of them
  let bestTradeSoFar: Trade<TInput, TOutput, TradeType> | null = null
  for (let i = 1; i <= maxHops; i++) {
    const currentTrade: Trade<TInput, TOutput, TradeType> | null =
      Trade.bestTradeExactIn(allowedPairs, amountIn, output, {
        ...options,
        maxHops: i,
        maxNumResults: 1,
      })[0] ?? null
    // if current trade is best yet, save it
    if (isTradeBetter(bestTradeSoFar, currentTrade, BETTER_TRADE_LESS_HOPS_THRESHOLD)) {
      bestTradeSoFar = currentTrade
    }
  }
  return bestTradeSoFar
}
