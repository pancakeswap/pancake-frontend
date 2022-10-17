import { Percent, Price, Currency } from '@pancakeswap/sdk'

const getRatePercentageDifference = (
  currentMarketRate: Price<Currency, Currency>,
  price: Price<Currency, Currency>,
) => {
  if (currentMarketRate && price) {
    const percentageAsFraction = price.subtract(currentMarketRate).divide(currentMarketRate)
    return new Percent(percentageAsFraction.numerator, percentageAsFraction.denominator)
  }
  return undefined
}

export default getRatePercentageDifference
