import { Currency, CurrencyAmount, Price, TradeType } from '@pancakeswap/sdk'

import { getBestTradeFromV2ExactIn, getBestTradeFromV2ExactOut } from './getBestTradeFromV2'
import { getBestTradeWithStableSwap } from './getBestTradeWithStableSwap'
import { stableSwapPairsByChainId } from './getStableSwapPairs'
import { getStableSwapFee, getStableSwapOutputAmount } from './onchain'
import { createTradeWithStableSwap, createTradeWithStableSwapFromV2Trade, getFeePercent } from './stableSwap'
import { BestTradeOptions, RouteType, StableSwapPair, TradeWithStableSwap } from './types'

export const getBestTradeExactIn = createGetBestTrade(TradeType.EXACT_INPUT)

export const getBestTradeExactOut = createGetBestTrade(TradeType.EXACT_OUTPUT)

const isDirectStableSwapTrade = (currencyIn: Currency, currencyOut: Currency, stableSwapPairs: StableSwapPair[]) => {
  const directStablePair = stableSwapPairs.find((p) => p.involvesToken(currencyIn) && p.involvesToken(currencyOut))
  return directStablePair
}

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

    const stableSwapPairs = stableSwapPairsByChainId[chainId] || []

    const directStablePair = isDirectStableSwapTrade(amountIn.currency, output, stableSwapPairs)

    let stableSwapTrade

    if (directStablePair) {
      const [outputAmount, fees] = await Promise.all([
        getStableSwapOutputAmount(directStablePair, amountIn, { provider }),
        getStableSwapFee(directStablePair, amountIn, { provider }),
      ])
      const { fee, adminFee } = getFeePercent(amountIn, outputAmount, fees)

      const pairs = [
        {
          ...directStablePair,
          price: new Price({ baseAmount: amountIn, quoteAmount: outputAmount.add(fees.fee) }),
          fee,
          adminFee,
        },
      ]

      stableSwapTrade = createTradeWithStableSwap({
        routeType: RouteType.STABLE_SWAP,
        inputAmount: amountIn,
        outputAmount,
        pairs,
        tradeType: TradeType.EXACT_INPUT,
      })
    }

    if (!bestTradeV2) {
      if (stableSwapTrade) {
        return stableSwapTrade
      }
      return null
    }

    const bestTradeWithStableSwap = await getBestTradeWithStableSwap(bestTradeV2, stableSwapPairs, { provider })
    const { outputAmount: outputAmountWithStableSwap } = bestTradeWithStableSwap

    if (
      stableSwapTrade &&
      stableSwapTrade.outputAmount.greaterThan(outputAmountWithStableSwap) &&
      stableSwapTrade.outputAmount.greaterThan(bestTradeV2.outputAmount)
    ) {
      return stableSwapTrade
    }

    // If stable swap is not as good as best trade got from v2, then use v2
    if (outputAmountWithStableSwap.lessThan(bestTradeV2.outputAmount)) {
      return createTradeWithStableSwapFromV2Trade(bestTradeV2)
    }

    return bestTradeWithStableSwap
  }
}
