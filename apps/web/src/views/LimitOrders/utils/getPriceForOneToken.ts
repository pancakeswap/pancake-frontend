import { CurrencyAmount, Price } from '@pancakeswap/sdk'

/**
 * Given certain amount if input and output tokens
 * calculate the price for 1 input token in terms of output tokens
 */
const getPriceForOneToken = (inputAmount: CurrencyAmount, outputAmount: CurrencyAmount) => {
  if (!inputAmount || !outputAmount || inputAmount.equalTo(0) || outputAmount.equalTo(0)) {
    return undefined
  }
  return new Price(inputAmount.currency, outputAmount.currency, inputAmount.raw, outputAmount.raw)
}

export default getPriceForOneToken
