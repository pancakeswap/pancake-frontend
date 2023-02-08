/* eslint-disable no-console */
import { QuoteProvider, OnChainProvider, RouteWithoutQuote, RouteWithQuote, RouteType } from '../types'
import { isV3Pool } from '../utils'
import { createOffChainQuoteProvider } from './offChainQuoteProvider'

interface Config {
  onChainProvider: OnChainProvider
}

// For evm
export function createQuoteProvider({ onChainProvider }: Config): QuoteProvider {
  console.log(onChainProvider)
  const offChainQuoteProvider = createOffChainQuoteProvider()

  const createGetRouteWithQuotes = (isExactIn = true) => {
    const getOffChainQuotes = isExactIn
      ? offChainQuoteProvider.getRouteWithQuotesExactIn
      : offChainQuoteProvider.getRouteWithQuotesExactOut

    return async function getRoutesWithQuotes(routes: RouteWithoutQuote[]): Promise<RouteWithQuote[]> {
      const v3Routes: RouteWithoutQuote[] = []
      const mixedRoutesHaveV3Pool: RouteWithoutQuote[] = []
      const routesCanQuoteOffChain: RouteWithoutQuote[] = []
      for (const route of routes) {
        if (route.type === RouteType.V2 || route.type === RouteType.STABLE) {
          routesCanQuoteOffChain.push(route)
          continue
        }
        if (route.type === RouteType.V3) {
          v3Routes.push(route)
          continue
        }
        const { pools } = route
        if (pools.some((pool) => isV3Pool(pool))) {
          mixedRoutesHaveV3Pool.push(route)
          continue
        }
        routesCanQuoteOffChain.push(route)
      }

      const [offChainQuotes] = await Promise.all([getOffChainQuotes(routesCanQuoteOffChain)])
      return [...offChainQuotes]
    }
  }

  return {
    getRouteWithQuotesExactIn: createGetRouteWithQuotes(true),
    getRouteWithQuotesExactOut: createGetRouteWithQuotes(false),
  }
}
