/* eslint-disable no-console */
import { Currency, CurrencyAmount, TradeType, JSBI } from '@pancakeswap/sdk'

import { computeAllRoutes } from './functions'
import { getRoutesWithValidQuote } from './getRoutesWithValidQuote'
import { PoolProvider, QuoteProvider, Route, RouteWithQuote, Trade } from './types'

interface Config {
  maxHops?: number
  maxSplits?: number
  distributionPercent?: number
  poolProvider: PoolProvider
  quoteProvider: QuoteProvider
}

interface BestTrade {
  trade: Trade<TradeType>
  estimatedGasUsed: JSBI
  estimatedGasUsedUSD: JSBI
}

export async function getBestTrade(
  amount: CurrencyAmount<Currency>,
  currency: Currency,
  tradeType: TradeType,
  config: Config,
): Promise<BestTrade | null> {
  try {
    const bestRoutes = await getBestRoutes(amount, currency, tradeType, config)
    if (!bestRoutes) {
      return null
    }

    const { routes, estimatedGasUsed, estimatedGasUsedUSD } = bestRoutes
    // TODO restrict trade type to exact input if routes include one of the old
    // stable swap pools, which only allow to swap with exact input
    return {
      estimatedGasUsedUSD,
      estimatedGasUsed,
      trade: {
        tradeType,
        routes,
      },
    }
  } catch (e) {
    console.error(e)
    return null
  }
}

interface BestRoutes {
  estimatedGasUsed: JSBI
  estimatedGasUsedUSD: JSBI
  routes: Route[]
}

async function getBestRoutes(
  amount: CurrencyAmount<Currency>,
  currency: Currency,
  tradeType: TradeType,
  { maxHops = 3, maxSplits = 4, distributionPercent = 5, poolProvider, quoteProvider }: Config,
): Promise<BestRoutes | null> {
  const isExactIn = tradeType === TradeType.EXACT_INPUT
  const inputCurrency = isExactIn ? amount.currency : currency
  const outputCurrency = isExactIn ? currency : amount.currency

  const candidatePools = await poolProvider?.getCandidatePools(amount.currency, currency, 0)
  if (!candidatePools) {
    return null
  }

  const baseRoutes = computeAllRoutes(inputCurrency, outputCurrency, candidatePools)
  const routesWithValidQuote = await getRoutesWithValidQuote({
    amount,
    baseRoutes,
    distributionPercent,
    quoteProvider,
    tradeType,
  })
  // routesWithValidQuote.forEach(({ percent, path, amount: a, quote }) => {
  //   const pathStr = path.map((t) => t.symbol).join('->')
  //   console.log(
  //     `${percent}% Swap`,
  //     a.toExact(),
  //     a.currency.symbol,
  //     'through',
  //     pathStr,
  //     ':',
  //     quote.toExact(),
  //     quote.currency.symbol,
  //   )
  // })
  console.log(amount, currency, tradeType, maxHops, maxSplits)
  return getBestRoutesByQuotes(amount, routesWithValidQuote)
}

function getBestRoutesByQuotes(amount: CurrencyAmount<Currency>, routesWithQuote: RouteWithQuote[]): BestRoutes | null {
  console.log(amount, routesWithQuote)
  return null
}
