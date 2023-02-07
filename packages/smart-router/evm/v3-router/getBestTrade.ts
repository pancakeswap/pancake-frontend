/* eslint-disable no-console */
import { Currency, CurrencyAmount, TradeType, JSBI } from '@pancakeswap/sdk'

import { computeAllRoutes } from './functions'
import { BaseRoute, PoolProvider, QuoteProvider, Route, RouteWithValidQuotes, Trade } from './types'

interface Config {
  maxHops?: number
  maxSplits?: number
  distributionPercent?: number
  poolProvider?: PoolProvider
  quoteProvider?: QuoteProvider
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
  config: Config = {},
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
  { maxHops = 3, maxSplits = 4, distributionPercent = 5, poolProvider }: Config = {},
): Promise<BestRoutes | null> {
  const isExactIn = tradeType === TradeType.EXACT_INPUT
  const inputCurrency = isExactIn ? amount.currency : currency
  const outputCurrency = isExactIn ? currency : amount.currency

  const candidatePools = await poolProvider?.getCandidatePools(amount.currency, currency, 0)
  if (!candidatePools) {
    return null
  }

  const baseRoutes = computeAllRoutes(inputCurrency, outputCurrency, candidatePools)
  const routesWithValidQuotes = await getRoutesWithValidQuotes(amount, baseRoutes, distributionPercent)
  console.log(amount, currency, tradeType, maxHops, maxSplits)
  return getBestRoutesByQuotes(amount, routesWithValidQuotes)
}

async function getRoutesWithValidQuotes(
  amount: CurrencyAmount<Currency>,
  baseRoutes: BaseRoute[],
  distributionPercent: number,
): Promise<RouteWithValidQuotes[]> {
  console.log(amount, baseRoutes, distributionPercent)
  return []
}

function getBestRoutesByQuotes(
  amount: CurrencyAmount<Currency>,
  routesWithValidQuotes: RouteWithValidQuotes[],
): BestRoutes | null {
  console.log(amount, routesWithValidQuotes)
  return null
}
