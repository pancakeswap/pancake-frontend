/* eslint-disable no-console */
import { BigintIsh, Currency, CurrencyAmount, TradeType } from '@pancakeswap/sdk'

import { BaseRoute, GasModel, QuoteProvider, RouteWithoutQuote, RouteWithQuote } from './types'
import { getAmountDistribution } from './functions'
import { metric } from './utils/metric'

interface Params {
  blockNumber?: BigintIsh
  amount: CurrencyAmount<Currency>
  baseRoutes: BaseRoute[]
  distributionPercent: number
  quoteProvider: QuoteProvider
  tradeType: TradeType
  gasModel: GasModel
  quoterOptimization?: boolean | number
}

export async function getRoutesWithValidQuote({
  amount,
  baseRoutes,
  distributionPercent,
  quoteProvider,
  tradeType,
  blockNumber,
  gasModel,
  quoterOptimization = true,
}: Params): Promise<RouteWithQuote[]> {
  const [percents, amounts] = getAmountDistribution(amount, distributionPercent)
  const routesWithoutQuote = amounts.reduce<RouteWithoutQuote[]>(
    (acc, curAmount, i) => [
      ...acc,
      ...baseRoutes.map((r) => ({
        ...r,
        amount: curAmount,
        percent: percents[i],
      })),
    ],
    [],
  )
  const getRoutesWithQuote =
    tradeType === TradeType.EXACT_INPUT
      ? quoteProvider.getRouteWithQuotesExactIn
      : quoteProvider.getRouteWithQuotesExactOut

  metric('Get quotes', 'from', routesWithoutQuote.length, 'routes', routesWithoutQuote)
  const quotes = await getRoutesWithQuote(routesWithoutQuote, { blockNumber, gasModel, quoterOptimization })
  metric('Get quotes', 'success, got', quotes.length, 'quoted routes', quotes)
  return quotes
}
