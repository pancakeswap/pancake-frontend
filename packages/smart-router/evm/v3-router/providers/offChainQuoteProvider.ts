import { Currency, CurrencyAmount, JSBI, Pair } from '@pancakeswap/sdk'

import { QuoteProvider, RouteType, RouteWithoutQuote, RouteWithQuote, V2Pool } from '../types'

// TODO Gas Model

export function createOffChainQuoteProvider(): QuoteProvider {
  const createGetRoutesWithQuotes = (isExactIn = true) => {
    const getV2Quote = createGetV2Quote(isExactIn)

    return async function getRoutesWithQuotes(routes: RouteWithoutQuote[]): Promise<RouteWithQuote[]> {
      return routes
        .map<RouteWithQuote | null>((route) => {
          const { pools, type, amount } = route
          // TODO do not deal with routes other than v2
          if (type !== RouteType.V2) {
            return null
          }
          let quote = amount
          for (const pool of pools) {
            quote = getV2Quote(pool as V2Pool, quote)
          }

          return {
            ...route,
            quote,
            // TODO gas model
            quoteAdjustedForGas: quote,
            gasEstimate: JSBI.BigInt(0),
            gasCostInUSD: quote,
            gasCostInToken: quote,
          }
        })
        .filter((r): r is RouteWithQuote => !!r)
    }
  }

  return {
    getRouteWithQuotesExactIn: createGetRoutesWithQuotes(true),
    getRouteWithQuotesExactOut: createGetRoutesWithQuotes(false),
  }
}

function createGetV2Quote(isExactIn = true) {
  return function getV2Quote(
    { reserve0, reserve1 }: V2Pool,
    amount: CurrencyAmount<Currency>,
  ): CurrencyAmount<Currency> {
    const pair = new Pair(reserve0.wrapped, reserve1.wrapped)
    const [quote] = isExactIn ? pair.getOutputAmount(amount.wrapped) : pair.getInputAmount(amount.wrapped)
    return quote
  }
}
