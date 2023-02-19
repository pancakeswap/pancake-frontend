import { BigintIsh, Currency, CurrencyAmount, TradeType } from '@pancakeswap/sdk'
import chunk from 'lodash/chunk'

import { BaseRoute, GasModel, QuoteProvider, RouteWithoutQuote, RouteWithQuote } from './types'
import { getAmountDistribution } from './functions'

interface Params {
  blockNumber: BigintIsh
  amount: CurrencyAmount<Currency>
  baseRoutes: BaseRoute[]
  distributionPercent: number
  quoteProvider: QuoteProvider
  tradeType: TradeType
  gasModel: GasModel
}

export async function getRoutesWithValidQuote({
  amount,
  baseRoutes,
  distributionPercent,
  quoteProvider,
  tradeType,
  blockNumber,
  gasModel,
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

  // FIXME won't work on server side
  // Split into chunks so the calculation won't block the main thread
  const getQuotes = (routes: RouteWithoutQuote[]): Promise<RouteWithQuote[]> =>
    new Promise((resolve, reject) => {
      requestIdleCallback(async () => {
        try {
          const result = await getRoutesWithQuote(routes, { blockNumber, gasModel })
          resolve(result)
        } catch (e) {
          reject(e)
        }
      })
    })
  const chunks = chunk(routesWithoutQuote, 20)
  const result = await Promise.all(chunks.map(getQuotes))
  return result.reduce<RouteWithQuote[]>((acc, cur) => [...acc, ...cur], [])
}
