import { Currency, CurrencyAmount, JSBI, Pair } from '@pancakeswap/sdk'
import { Pool as V3Pool, TickMath } from '@pancakeswap/v3-sdk'

import {
  Pool as IPool,
  QuoteProvider,
  RouteWithoutQuote,
  RouteWithQuote,
  StablePool,
  V2Pool,
  V3Pool as IV3Pool,
} from '../types'
import { StableSwap } from '../../stableSwap'
import { getOutputCurrency, getUsdGasToken, isStablePool, isV2Pool, isV3Pool } from '../utils'

// TODO Gas Model

export function createOffChainQuoteProvider(): QuoteProvider {
  const createGetRoutesWithQuotes = (isExactIn = true) => {
    const getV2Quote = createGetV2Quote(isExactIn)
    const getStableQuote = createGetStableQuote(isExactIn)
    const getV3Quote = createGetV3Quote(isExactIn)
    function* each(pools: IPool[]) {
      let i = isExactIn ? 0 : pools.length - 1
      const hasNext = () => (isExactIn ? i < pools.length : i >= 0)
      while (hasNext()) {
        yield pools[i]
        if (isExactIn) {
          i += 1
        } else {
          i -= 1
        }
      }
    }

    return async function getRoutesWithQuotes(routes: RouteWithoutQuote[]): Promise<RouteWithQuote[]> {
      const routesWithQuote: RouteWithQuote[] = []
      for (const route of routes) {
        const { pools, amount } = route
        let quote = amount
        for (const pool of each(pools)) {
          if (isV2Pool(pool)) {
            quote = getV2Quote(pool, quote)
            continue
          }
          if (isStablePool(pool)) {
            quote = getStableQuote(pool, quote)
            continue
          }
          if (isV3Pool(pool)) {
            // It's ok to await in loop because we only get quote from v3 pools who have local ticks data as tick provider
            // eslint-disable-next-line no-await-in-loop
            const v3Quote = await getV3Quote(pool, quote)
            if (!v3Quote) {
              break
            }
            quote = v3Quote
          }
        }

        const usdToken = getUsdGasToken(quote.currency.chainId)
        if (!usdToken) {
          console.warn('Cannot find usd gas token on chain', quote.currency.chainId)
        }
        routesWithQuote.push({
          ...route,
          quote,
          // TODO gas model
          quoteAdjustedForGas: quote,
          gasEstimate: JSBI.BigInt(0),
          gasCostInUSD: CurrencyAmount.fromRawAmount(usdToken || quote.currency, 0),
          gasCostInToken: CurrencyAmount.fromRawAmount(quote.currency.wrapped, 0),
        })
      }
      return routesWithQuote
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

function createGetStableQuote(isExactIn = true) {
  const getQuote = isExactIn ? StableSwap.getSwapOutput : StableSwap.getSwapInput
  return function getStableQuote(pool: StablePool, amount: CurrencyAmount<Currency>): CurrencyAmount<Currency> {
    const { amplifier, balances, fee } = pool
    return getQuote({
      amount,
      balances,
      amplifier,
      outputCurrency: getOutputCurrency(pool, amount.currency),
      fee,
    })
  }
}

function createGetV3Quote(isExactIn = true) {
  return async function getStableQuote(
    pool: IV3Pool,
    amount: CurrencyAmount<Currency>,
  ): Promise<CurrencyAmount<Currency> | null> {
    const { token0, token1, fee, sqrtRatioX96, liquidity, ticks } = pool
    if (!ticks?.length) {
      return null
    }
    const v3Pool = new V3Pool(
      token0.wrapped,
      token1.wrapped,
      fee,
      sqrtRatioX96,
      liquidity,
      TickMath.getTickAtSqrtRatio(sqrtRatioX96),
    )
    const getQuotePromise = isExactIn ? v3Pool.getOutputAmount(amount.wrapped) : v3Pool.getInputAmount(amount.wrapped)
    const [quote] = await getQuotePromise
    return quote
  }
}
