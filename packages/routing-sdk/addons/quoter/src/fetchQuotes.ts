import { CurrencyAmount } from '@pancakeswap/swap-sdk-core'

import { SupportedPool, buildV3QuoteCall } from './fetchV3Quote'
import { FetchQuotes } from './types'
import { isV3Route } from './utils'
import { buildMixedRouteQuoteCall } from './fetchMixedRouteQuote'

export const fetchQuotes: FetchQuotes<SupportedPool> = async ({ routes, client }) => {
  const [route] = routes
  const { amount, path } = route
  const isExactOut = path[path.length - 1].wrapped.equals(amount.currency.wrapped)
  const results = await client.multicall({
    contracts: routes.map((r) => {
      if (isV3Route(r)) {
        return buildV3QuoteCall<SupportedPool>(r)
      }
      return buildMixedRouteQuoteCall<SupportedPool>(r)
    }),
  })

  return results.map((result, i) => {
    if (result.status === 'failure') {
      console.error('[QUOTER]: fail to get quote', result.error)
      return undefined
    }
    const { path: currentPath } = routes[i]
    const outCurrency = isExactOut ? currentPath[0] : currentPath[currentPath.length - 1]
    const [quote, , , gasUseEstimate] = result.result
    return {
      quote: CurrencyAmount.fromRawAmount(outCurrency, quote),
      gasUseEstimate,
    }
  })
}
