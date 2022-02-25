import { CurrencyAmount, JSBI, Price } from '@pancakeswap/sdk'

/**
 * Given certain amount if input and output tokens
 * calculate the price for 1 input token in terms of output tokens
 */
const getPriceForOneToken = (inputAmount: CurrencyAmount, outputAmount: CurrencyAmount) => {
  if (!inputAmount || !outputAmount || inputAmount.equalTo(0) || outputAmount.equalTo(0)) {
    return undefined
  }
  const inputDecimals = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(inputAmount.currency.decimals))
  const outputDecimals = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(outputAmount.currency.decimals))
  const fractionPerOneToken = outputAmount.asFraction
    .divide(inputAmount.asFraction)
    .divide(inputDecimals)
    .multiply(outputDecimals)
  return new Price(
    inputAmount.currency,
    outputAmount.currency,
    fractionPerOneToken.denominator,
    fractionPerOneToken.numerator,
  )
}

export default getPriceForOneToken
