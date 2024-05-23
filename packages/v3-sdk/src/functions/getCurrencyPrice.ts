import { BigintIsh, Price } from '@pancakeswap/sdk'
import { Currency } from '@pancakeswap/swap-sdk-core'
import { Q192 } from '../internalConstants'

/**
 * Returns the current price of the given tokens
 */
export const getCurrency0Price = (
  [currency0, currency1]: [Currency, Currency],
  currentSqrtRatioX96: BigintIsh
): Price<Currency, Currency> => {
  const ratio192 = BigInt(currentSqrtRatioX96) * BigInt(currentSqrtRatioX96)

  return new Price(currency0, currency1, Q192, ratio192)
}

/**
 * Returns the current price of the given tokens
 */
export const getCurrency1Price = (
  [currency0, currency1]: [Currency, Currency],
  currentSqrtRatioX96: BigintIsh
): Price<Currency, Currency> => {
  const ratio192 = BigInt(currentSqrtRatioX96) * BigInt(currentSqrtRatioX96)

  return new Price(currency1, currency0, Q192, ratio192)
}
