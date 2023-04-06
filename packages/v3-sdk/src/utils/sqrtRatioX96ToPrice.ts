import { Currency, Price } from '@pancakeswap/swap-sdk-core'
import JSBI from 'jsbi'

import { Q192 } from '../internalConstants'

export function sqrtRatioX96ToPrice(sqrtRatioX96: JSBI, currencyA: Currency, currencyB: Currency) {
  const ratioX192 = JSBI.multiply(sqrtRatioX96, sqrtRatioX96)

  return currencyA.wrapped.sortsBefore(currencyB.wrapped)
    ? new Price(currencyA.wrapped, currencyB.wrapped, Q192, ratioX192)
    : new Price(currencyA.wrapped, currencyB.wrapped, ratioX192, Q192)
}
