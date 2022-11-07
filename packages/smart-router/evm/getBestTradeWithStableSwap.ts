/* eslint-disable no-await-in-loop, no-continue */
import { Currency, CurrencyAmount, Pair, Trade, TradeType } from '@pancakeswap/sdk'

import { getBestTradeFromV2 } from './getBestTradeFromV2'
import { getStableSwapOutputAmount } from './onchain'
import { createTradeWithStableSwap } from './stableSwap'
import { BestTradeOptions, StableSwapPair, TradeWithStableSwap } from './types'
import { getOutputToken, isSamePair } from './utils/pair'

export async function getBestTradeWithStableSwap<TInput extends Currency, TOutput extends Currency>(
  baseTrade: Trade<TInput, TOutput, TradeType>,
  stableSwapPairs: StableSwapPair[],
  options: BestTradeOptions,
): Promise<TradeWithStableSwap<TInput, TOutput, TradeType>> {
  const { provider } = options
  const { inputAmount, route, tradeType } = baseTrade
  // Early return if there's no stableswap available
  if (!stableSwapPairs.length) {
    return baseTrade
  }

  const findStableSwapPair = (pair: Pair) => stableSwapPairs.find((p) => isSamePair(p, pair))

  let outputAmount: CurrencyAmount<Currency> = inputAmount
  let outputToken: Currency = inputAmount.currency
  const shouldRecalculateOutputAmount = () => !outputToken.equals(outputAmount.currency)
  const getLatestOutputAmount = async () => {
    // If the output amount is never re-calculated and the output token is the same as base trade route,
    // means that there's no stable swap pair found in the base route.
    if (outputAmount.currency.equals(inputAmount.currency) && outputToken.equals(baseTrade.outputAmount.currency)) {
      return baseTrade.outputAmount
    }
    return shouldRecalculateOutputAmount() ? getOutputAmountFromV2(outputAmount, outputToken, options) : outputAmount
  }

  const pairsWithStableSwap: (Pair | StableSwapPair)[] = []
  for (const [index, pair] of route.pairs.entries()) {
    const stableSwapPair = findStableSwapPair(pair)
    if (stableSwapPair) {
      // Get latest output amount from v2 and use it as input to get output amount from stable swap
      outputAmount = await getLatestOutputAmount()
      outputAmount = await getStableSwapOutputAmount(stableSwapPair, outputAmount, { provider })
      outputToken = getOutputToken(stableSwapPair, outputToken)
      pairsWithStableSwap.push(stableSwapPair)
      continue
    }

    outputToken = getOutputToken(pair, outputToken)
    if (index === route.pairs.length - 1) {
      outputAmount = await getLatestOutputAmount()
    }
    pairsWithStableSwap.push(pair)
  }

  return createTradeWithStableSwap({
    pairs: pairsWithStableSwap,
    inputAmount,
    // TODO add invariant check to make sure output amount has the same currency as the baseTrade output
    outputAmount: outputAmount as CurrencyAmount<TOutput>,
    tradeType,
  })
}

async function getOutputAmountFromV2<TInput extends Currency, TOutput extends Currency>(
  inputAmount: CurrencyAmount<TInput>,
  outputToken: TOutput,
  options: BestTradeOptions,
) {
  const trade = await getBestTradeFromV2(inputAmount, outputToken, options)

  if (!trade) {
    throw new Error(`Cannot get valid trade from ${inputAmount.currency.name} to ${outputToken.name}`)
  }
  return trade.outputAmount
}
