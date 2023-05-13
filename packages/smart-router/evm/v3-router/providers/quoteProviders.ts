/* eslint-disable no-console */
import { BatchMulticallConfigs, ChainMap } from '../../types'
import { QuoteProvider, OnChainProvider, RouteWithoutQuote, RouteWithQuote, RouteType, QuoterOptions } from '../types'
import { isV3Pool } from '../utils'
import { createOffChainQuoteProvider } from './offChainQuoteProvider'
import { createMixedRouteOnChainQuoteProvider, createV3OnChainQuoteProvider } from './onChainQuoteProvider'

interface Config {
  onChainProvider: OnChainProvider
  multicallConfigs?: ChainMap<BatchMulticallConfigs>
}

// For evm
export function createQuoteProvider({ onChainProvider, multicallConfigs }: Config): QuoteProvider {
  const offChainQuoteProvider = createOffChainQuoteProvider()
  const mixedRouteOnChainQuoteProvider = createMixedRouteOnChainQuoteProvider({ onChainProvider, multicallConfigs })
  const v3OnChainQuoteProvider = createV3OnChainQuoteProvider({ onChainProvider, multicallConfigs })

  const createGetRouteWithQuotes = (isExactIn = true) => {
    const getOffChainQuotes = isExactIn
      ? offChainQuoteProvider.getRouteWithQuotesExactIn
      : offChainQuoteProvider.getRouteWithQuotesExactOut
    const getMixedRouteQuotes = isExactIn
      ? mixedRouteOnChainQuoteProvider.getRouteWithQuotesExactIn
      : mixedRouteOnChainQuoteProvider.getRouteWithQuotesExactOut
    const getV3Quotes = isExactIn
      ? v3OnChainQuoteProvider.getRouteWithQuotesExactIn
      : v3OnChainQuoteProvider.getRouteWithQuotesExactOut

    return async function getRoutesWithQuotes(
      routes: RouteWithoutQuote[],
      { blockNumber, gasModel }: QuoterOptions,
    ): Promise<RouteWithQuote[]> {
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

      const [offChainQuotes, mixedRouteQuotes, v3Quotes] = await Promise.all([
        getOffChainQuotes(routesCanQuoteOffChain, { blockNumber, gasModel }),
        getMixedRouteQuotes(mixedRoutesHaveV3Pool, { blockNumber, gasModel }),
        getV3Quotes(v3Routes, { blockNumber, gasModel }),
      ])
      return [...offChainQuotes, ...mixedRouteQuotes, ...v3Quotes]
    }
  }

  return {
    getRouteWithQuotesExactIn: createGetRouteWithQuotes(true),
    getRouteWithQuotesExactOut: createGetRouteWithQuotes(false),
  }
}
