import { Price } from '@pancakeswap/sdk'
/**
 * Helper to multiply a Price object by an arbitrary amount
 */
export const multiplyPriceByAmount = (price: Price, amount: number, significantDigits = 18) => {
  if (!price) {
    return 0
  }

  return parseFloat(price.toSignificant(significantDigits)) * amount
}
