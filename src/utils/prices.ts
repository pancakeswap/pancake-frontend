import { CurrencyAmount, Percent, Price } from '@pancakeswap/sdk'
/**
 * Helper to multiply a Price object by an arbitrary amount
 */
export const multiplyPriceByAmount = (price: Price, amount: number, significantDigits = 18) => {
  if (!price) {
    return 0
  }

  return parseFloat(price.toSignificant(significantDigits)) * amount
}

/**
 * Returns the percent difference between the mid price and the execution price, i.e. price impact.
 * @param midPrice mid price before the trade
 * @param inputAmount the input amount of the trade
 * @param outputAmount the output amount of the trade
 */
export function computePriceImpact(
  midPrice: Price,
  inputAmount: CurrencyAmount,
  outputAmount: CurrencyAmount,
): Percent {
  const exactQuote = midPrice.raw.multiply(inputAmount.raw)
  // calculate slippage := (exactQuote - outputAmount) / exactQuote
  const slippage = exactQuote.subtract(outputAmount.raw).divide(exactQuote)
  return new Percent(slippage.numerator, slippage.denominator)
}
