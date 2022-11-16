import { Currency, CurrencyAmount, TradeType } from '@pancakeswap/sdk'

import { getBestTradeFromV2ExactIn, getBestTradeFromV2ExactOut } from './getBestTradeFromV2'
import { getBestTradeWithStableSwap } from './getBestTradeWithStableSwap'
import { getStableSwapPairs } from './getStableSwapPairs'
import { createTradeWithStableSwapFromV2Trade } from './stableSwap'
import { BestTradeOptions, TradeWithStableSwap } from './types'

export const getBestTradeExactIn = createGetBestTrade(TradeType.EXACT_INPUT)

export const getBestTradeExactOut = createGetBestTrade(TradeType.EXACT_OUTPUT)

function createGetBestTrade<TTradeType extends TradeType>(tradeType: TTradeType) {
  const getBestTradeFromV2 =
    tradeType === TradeType.EXACT_INPUT ? getBestTradeFromV2ExactIn : getBestTradeFromV2ExactOut
  return async function getBestTrade(
    amountIn: CurrencyAmount<Currency>,
    output: Currency,
    options: BestTradeOptions,
  ): Promise<TradeWithStableSwap<Currency, Currency, TradeType> | null> {
    const { provider } = options
    // TODO invariant check input and output on the same chain
    const {
      currency: { chainId },
    } = amountIn

    const bestTradeV2 = await getBestTradeFromV2(amountIn, output, options)
    if (!bestTradeV2) {
      return null
    }

    const stableSwapPairs = getStableSwapPairs(chainId)
    const bestTradeWithStableSwap = await getBestTradeWithStableSwap(bestTradeV2, stableSwapPairs, { provider })
    const { outputAmount: outputAmountWithStableSwap } = bestTradeWithStableSwap

    // If stable swap is not as good as best trade got from v2, then use v2
    if (outputAmountWithStableSwap.lessThan(bestTradeV2.outputAmount)) {
      return createTradeWithStableSwapFromV2Trade(bestTradeV2)
    }

    return bestTradeWithStableSwap
  }
}
