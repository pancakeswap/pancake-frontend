/* eslint-disable no-await-in-loop, no-continue */
import { Currency, CurrencyAmount, Price, TradeType } from '@pancakeswap/sdk'

import { BestTradeOptions, Pair, RouteType, StableSwapPair, TradeWithStableSwap } from './types'
import { getOutputToken, involvesToken } from './utils/pair'
import { stableSwapPairsByChainId } from './getStableSwapPairs'
import { getStableSwapFee, getStableSwapOutputAmount } from './onchain'
import { createTradeWithStableSwap, getFeePercent } from './stableSwap'

export async function getBestTradeFromStablePools(
  amount: CurrencyAmount<Currency>,
  output: Currency,
  { maxHops, provider }: BestTradeOptions,
) {
  const {
    currency: { chainId },
  } = amount
  const pairs = stableSwapPairsByChainId[chainId] || []
  const routes = computeAllRoutes(amount.currency, output, pairs, maxHops)
  const trades = await Promise.all(routes.map((r) => getStableTrade(amount, r, { provider })))
  if (!trades.length) {
    return null
  }
  let bestTrade = trades[0]
  for (let i = 1; i < trades.length; i += 1) {
    const trade = trades[i]
    if (trade.outputAmount.greaterThan(bestTrade.outputAmount)) {
      bestTrade = trade
    }
  }
  return bestTrade
}

async function getStableTrade(
  amountIn: CurrencyAmount<Currency>,
  pairs: StableSwapPair[],
  { provider }: Pick<BestTradeOptions, 'provider'>,
): Promise<TradeWithStableSwap<Currency, Currency, TradeType>> {
  let outputToken = amountIn.currency
  let outputAmount = amountIn
  const pairsWithPrice: Pair[] = []
  for (const pair of pairs) {
    const inputAmount = outputAmount
    const results = await Promise.all([
      getStableSwapOutputAmount(pair, inputAmount, { provider }),
      getStableSwapFee(pair, inputAmount, { provider }),
    ])
    outputAmount = results[0]
    const fees = results[1]
    outputToken = getOutputToken(pair, outputToken)
    const { fee, adminFee } = getFeePercent(inputAmount, outputAmount, fees)
    pairsWithPrice.push({
      ...pair,
      price: new Price({ baseAmount: inputAmount, quoteAmount: outputAmount.add(fees.fee) }),
      fee,
      adminFee,
    })
  }
  return createTradeWithStableSwap({
    routeType: RouteType.STABLE_SWAP,
    inputAmount: amountIn,
    outputAmount,
    pairs: pairsWithPrice,
    tradeType: TradeType.EXACT_INPUT,
  })
}

function computeAllRoutes(input: Currency, output: Currency, pairs: StableSwapPair[], maxHops = 3): StableSwapPair[][] {
  const poolsUsed = Array<boolean>(pairs.length).fill(false)
  const routes: StableSwapPair[][] = []

  const computeRoutes = (
    currencyIn: Currency,
    currencyOut: Currency,
    currentRoute: StableSwapPair[],
    _previousCurrencyOut?: Currency,
  ) => {
    if (currentRoute.length > maxHops) {
      return
    }

    if (currentRoute.length > 0 && involvesToken(currentRoute[currentRoute.length - 1], currencyOut)) {
      routes.push([...currentRoute])
      return
    }

    for (let i = 0; i < pairs.length; i++) {
      if (poolsUsed[i]) {
        // eslint-disable-next-line
        continue
      }

      const curPool = pairs[i]
      const previousCurrencyOut = _previousCurrencyOut || currencyIn

      if (!involvesToken(curPool, previousCurrencyOut)) {
        // eslint-disable-next-line
        continue
      }

      const currentTokenOut = getOutputToken(curPool, previousCurrencyOut)

      currentRoute.push(curPool)
      poolsUsed[i] = true
      computeRoutes(currencyIn, currencyOut, currentRoute, currentTokenOut)
      poolsUsed[i] = false
      currentRoute.pop()
    }
  }

  computeRoutes(input, output, [])

  return routes
}
