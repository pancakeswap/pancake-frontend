import { Currency, CurrencyAmount, Trade, TradeType } from '@pancakeswap/sdk'

import { BETTER_TRADE_LESS_HOPS_THRESHOLD } from './constants'
import { getAllCommonPairs } from './getAllCommonPairs'
import { BestTradeOptions } from './types'
import { isTradeBetter } from './utils/trade'

export async function getBestTradeFromV2<TInput extends Currency, TOutput extends Currency>(
  amountIn: CurrencyAmount<TInput>,
  output: TOutput,
  options: BestTradeOptions,
): Promise<Trade<TInput, TOutput, TradeType> | null> {
  const { provider, ...restOptions } = options
  const { maxHops = 3 } = restOptions
  const allowedPairs = await getAllCommonPairs(amountIn.currency, output, { provider })

  if (!allowedPairs.length) {
    return null
  }

  if (maxHops === 1) {
    return Trade.bestTradeExactIn(allowedPairs, amountIn, output, restOptions)[0] ?? null
  }

  // search through trades with varying hops, find best trade out of them
  let bestTradeSoFar: Trade<TInput, TOutput, TradeType> | null = null
  for (let i = 1; i <= maxHops; i++) {
    const currentTrade: Trade<TInput, TOutput, TradeType> | null =
      Trade.bestTradeExactIn(allowedPairs, amountIn, output, {
        ...restOptions,
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
