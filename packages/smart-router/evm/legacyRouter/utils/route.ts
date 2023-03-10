import { Currency, Price } from '@pancakeswap/sdk'

import { RouteWithStableSwap } from '../types'
import { isStableSwapPair } from './pair'

export function getMidPrice<TIn extends Currency, TOut extends Currency>(
  route: RouteWithStableSwap<TIn, TOut>,
): Price<TIn, TOut> {
  // TODO caching
  const prices: Price<Currency, Currency>[] = []
  for (const [i, pair] of route.pairs.entries()) {
    if (isStableSwapPair(pair)) {
      prices.push(route.path[i].wrapped.equals(pair.price.baseCurrency.wrapped) ? pair.price : pair.price.invert())
      // eslint-disable-next-line no-continue
      continue
    }
    prices.push(
      route.path[i].wrapped.equals(pair.token0.wrapped)
        ? new Price(pair.reserve0.currency, pair.reserve1.currency, pair.reserve0.quotient, pair.reserve1.quotient)
        : new Price(pair.reserve1.currency, pair.reserve0.currency, pair.reserve1.quotient, pair.reserve0.quotient),
    )
  }
  const reduced = prices.slice(1).reduce((accumulator, currentValue) => accumulator.multiply(currentValue), prices[0])
  return new Price(route.input, route.output, reduced.denominator, reduced.numerator)
}
