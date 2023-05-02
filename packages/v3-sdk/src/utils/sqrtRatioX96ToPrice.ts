import { Currency, Price } from '@pancakeswap/swap-sdk-core'

import { Q192 } from '../internalConstants'

export function sqrtRatioX96ToPrice(sqrtRatioX96: bigint, currencyA: Currency, currencyB: Currency) {
  const ratioX192 = sqrtRatioX96 * sqrtRatioX96

  return currencyA.wrapped.sortsBefore(currencyB.wrapped)
    ? new Price(currencyA.wrapped, currencyB.wrapped, Q192, ratioX192)
    : new Price(currencyA.wrapped, currencyB.wrapped, ratioX192, Q192)
}
