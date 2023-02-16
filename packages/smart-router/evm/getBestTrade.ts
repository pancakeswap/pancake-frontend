import { Currency, CurrencyAmount, TradeType } from '@pancakeswap/sdk'
import { getBestTradeFromStablePools } from './getBestTradeFromStablePools'

import { getBestTradeFromV2ExactIn, getBestTradeFromV2ExactOut } from './getBestTradeFromV2'
import { getBestTradeWithStableSwap } from './getBestTradeWithStableSwap'
import { stableSwapPairsByChainId } from './getStableSwapPairs'
import { createTradeWithStableSwapFromV2Trade } from './stableSwap'
import { BestTradeOptions, TradeWithStableSwap } from './types'

export const getBestTradeExactIn = createGetBestTrade(TradeType.EXACT_INPUT)

export const getBestTradeExactOut = createGetBestTrade(TradeType.EXACT_OUTPUT)

function createGetBestTrade<TTradeType extends TradeType>(tradeType: TTradeType) {
  const isExactIn = tradeType === TradeType.EXACT_INPUT
  const getBestTradeFromV2 = isExactIn ? getBestTradeFromV2ExactIn : getBestTradeFromV2ExactOut
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
    const bestTradeStable =
      (bestTradeV2 || isExactIn) &&
      (await getBestTradeFromStablePools(
        bestTradeV2?.inputAmount || amountIn,
        bestTradeV2?.outputAmount.currency || output,
        options,
      ))

    if (!bestTradeV2) {
      if (bestTradeStable) {
        return bestTradeStable
      }
      return null
    }

    const stableSwapPairs = stableSwapPairsByChainId[chainId] || []
    const bestTradeWithStableSwap = await getBestTradeWithStableSwap(bestTradeV2, stableSwapPairs, { provider })
    const { outputAmount: outputAmountWithStableSwap } = bestTradeWithStableSwap

    if (
      bestTradeStable &&
      bestTradeStable.outputAmount.greaterThan(outputAmountWithStableSwap) &&
      bestTradeStable.outputAmount.greaterThan(bestTradeV2.outputAmount)
    ) {
      return bestTradeStable
    }

    // If stable swap is not as good as best trade got from v2, then use v2
    if (outputAmountWithStableSwap.lessThan(bestTradeV2.outputAmount)) {
      return createTradeWithStableSwapFromV2Trade(bestTradeV2)
    }

    return bestTradeWithStableSwap
  }
}
