import { Currency, CurrencyAmount, Pair, ZERO } from '@pancakeswap/sdk'
import { Pool as V3Pool, TickList } from '@pancakeswap/v3-sdk'
import {
  Pool as IPool,
  Pool,
  QuoteProvider,
  QuoterOptions,
  RouteWithoutQuote,
  RouteWithQuote,
  StablePool,
  V2Pool,
  V3Pool as IV3Pool,
} from '../types'
import * as StableSwap from '../../stableSwap'
import { getOutputCurrency, isStablePool, isV2Pool, isV3Pool } from '../utils'

export function createOffChainQuoteProvider(): QuoteProvider {
  const createGetRoutesWithQuotes = (isExactIn = true) => {
    const getV2Quote = createGetV2Quote(isExactIn)
    const getStableQuote = createGetStableQuote(isExactIn)
    const getV3Quote = createGetV3Quote(isExactIn)
    function* each(pools: IPool[]) {
      let i = isExactIn ? 0 : pools.length - 1
      const hasNext = () => (isExactIn ? i < pools.length : i >= 0)
      while (hasNext()) {
        yield [pools[i], i] as [Pool, number]
        if (isExactIn) {
          i += 1
        } else {
          i -= 1
        }
      }
    }
    const adjustQuoteForGas = (quote: CurrencyAmount<Currency>, gasCostInToken: CurrencyAmount<Currency>) => {
      if (isExactIn) {
        return quote.subtract(gasCostInToken)
      }
      return quote.add(gasCostInToken)
    }

    return async function getRoutesWithQuotes(
      routes: RouteWithoutQuote[],
      { gasModel }: QuoterOptions,
    ): Promise<RouteWithQuote[]> {
      const routesWithQuote: RouteWithQuote[] = []
      for (const route of routes) {
        try {
          const { pools, amount } = route
          let quote = amount
          const initializedTickCrossedList = Array(pools.length).fill(0)
          let quoteSuccess = true
          for (const [pool, i] of each(pools)) {
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
              const v3QuoteResult = await getV3Quote(pool, quote)
              if (!v3QuoteResult || v3QuoteResult.quote.quotient === ZERO) {
                quoteSuccess = false
                break
              }
              const { quote: v3Quote, numOfTicksCrossed } = v3QuoteResult
              quote = v3Quote
              initializedTickCrossedList[i] = numOfTicksCrossed
            }
          }
          if (!quoteSuccess) {
            continue
          }

          const { gasEstimate, gasCostInUSD, gasCostInToken } = gasModel.estimateGasCost(
            {
              ...route,
              quote,
            },
            { initializedTickCrossedList },
          )
          routesWithQuote.push({
            ...route,
            quote,
            quoteAdjustedForGas: adjustQuoteForGas(quote, gasCostInToken),
            gasEstimate,
            gasCostInUSD,
            gasCostInToken,
          })
        } catch (e) {
          // console.warn('Failed to get quote from route', route, e)
        }
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
  return async function getV3Quote(
    pool: IV3Pool,
    amount: CurrencyAmount<Currency>,
  ): Promise<{ quote: CurrencyAmount<Currency>; numOfTicksCrossed: number } | null> {
    const { token0, token1, fee, sqrtRatioX96, liquidity, ticks, tick } = pool
    if (!ticks?.length) {
      return null
    }
    try {
      const v3Pool = new V3Pool(token0.wrapped, token1.wrapped, fee, sqrtRatioX96, liquidity, tick, ticks)
      const [quote, poolAfter] = isExactIn
        ? await v3Pool.getOutputAmount(amount.wrapped)
        : await v3Pool.getInputAmount(amount.wrapped)

      // Not enough liquidity to perform the swap
      if (quote.quotient <= 0n) {
        return null
      }

      const { tickCurrent: tickAfter } = poolAfter
      const numOfTicksCrossed = TickList.countInitializedTicksCrossed(ticks, tick, tickAfter)
      return {
        quote,
        numOfTicksCrossed,
      }
    } catch (e) {
      // console.warn('No enough liquidity to perform swap', e)
      return null
    }
  }
}
