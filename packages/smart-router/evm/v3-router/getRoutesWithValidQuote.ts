import { BigintIsh, Currency, CurrencyAmount, TradeType } from '@pancakeswap/sdk'

import { BaseRoute, QuoteProvider, RouteWithoutQuote, RouteWithQuote } from './types'
import { getAmountDistribution } from './functions'

interface Params {
  blockNumber: BigintIsh
  amount: CurrencyAmount<Currency>
  baseRoutes: BaseRoute[]
  distributionPercent: number
  quoteProvider: QuoteProvider
  tradeType: TradeType
}

export async function getRoutesWithValidQuote({
  amount,
  baseRoutes,
  distributionPercent,
  quoteProvider,
  tradeType,
  blockNumber,
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
  return getRoutesWithQuote(routesWithoutQuote, { blockNumber })
}
