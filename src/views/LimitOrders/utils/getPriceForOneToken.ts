import { CurrencyAmount, Price, Currency } from '@pancakeswap/sdk'

/**
 * Given certain amount if input and output tokens
 * calculate the price for 1 input token in terms of output tokens
 */
const getPriceForOneToken = (inputAmount: CurrencyAmount<Currency>, outputAmount: CurrencyAmount<Currency>) => {
  if (!inputAmount || !outputAmount || inputAmount.equalTo(0) || outputAmount.equalTo(0)) {
    return undefined
  }
  return new Price(inputAmount.currency, outputAmount.currency, inputAmount.quotient, outputAmount.quotient)
}

export default getPriceForOneToken
