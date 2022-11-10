/* eslint-disable no-await-in-loop, no-continue */
import { Currency, CurrencyAmount, Pair, Trade, TradeType } from '@pancakeswap/sdk'

import { getBestTradeFromV2ExactIn } from './getBestTradeFromV2'
import { getStableSwapOutputAmount } from './onchain'
import { createTradeWithStableSwap, createTradeWithStableSwapFromV2Trade } from './stableSwap'
import { BestTradeOptions, RouteType, StableSwapPair } from './types'
import { getOutputToken, isSamePair } from './utils/pair'

export async function getBestTradeWithStableSwap(
  baseTrade: Trade<Currency, Currency, TradeType>,
  stableSwapPairs: StableSwapPair[],
  options: BestTradeOptions,
) {
  const { provider } = options
  const { inputAmount, route, tradeType } = baseTrade
  // Early return if there's no stableswap available
  if (!stableSwapPairs.length) {
    return createTradeWithStableSwapFromV2Trade(baseTrade)
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

  let routeType: RouteType | null = null
  const setCurrentRouteType = (type: RouteType) => {
    routeType = routeType === null || routeType === type ? type : RouteType.MIXED
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
      setCurrentRouteType(RouteType.STABLE_SWAP)
      continue
    }

    outputToken = getOutputToken(pair, outputToken)
    if (index === route.pairs.length - 1) {
      outputAmount = await getLatestOutputAmount()
    }
    pairsWithStableSwap.push(pair)
    setCurrentRouteType(RouteType.V2)
  }

  if (routeType === null) {
    throw new Error(`No valid route found`)
  }

  return createTradeWithStableSwap({
    routeType,
    pairs: pairsWithStableSwap,
    inputAmount,
    outputAmount,
    tradeType,
  })
}

async function getOutputAmountFromV2<TInput extends Currency, TOutput extends Currency>(
  inputAmount: CurrencyAmount<TInput>,
  outputToken: TOutput,
  options: BestTradeOptions,
) {
  // Since stable swap only supports exact in, we stick with exact in to
  // calculate the estimated output when replacing pairs with stable swap pair
  const trade = await getBestTradeFromV2ExactIn(inputAmount, outputToken, options)

  if (!trade) {
    throw new Error(`Cannot get valid trade from ${inputAmount.currency.name} to ${outputToken.name}`)
  }
  return trade.outputAmount
}
