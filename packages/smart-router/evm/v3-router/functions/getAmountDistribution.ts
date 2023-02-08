import { Currency, CurrencyAmount, Fraction } from '@pancakeswap/sdk'

/**
 * The minimum percentage of the input token to use for each route in a split route.
 * All routes will have a multiple of this value. For example is distribution percentage is 5,
 * a potential return swap would be:
 *
 * 5% of input => Route 1
 * 55% of input => Route 2
 * 40% of input => Route 3
 */
export function getAmountDistribution(
  amount: CurrencyAmount<Currency>,
  distributionPercent: number,
): [number[], CurrencyAmount<Currency>[]] {
  const percents: number[] = []
  const amounts: CurrencyAmount<Currency>[] = []

  for (let i = 1; i <= 100 / distributionPercent; i++) {
    // Note multiplications here can result in a loss of precision in the amounts (e.g. taking 50% of 101)
    // This is reconcilled at the end of the algorithm by adding any lost precision to one of
    // the splits in the route.
    percents.push(i * distributionPercent)
    amounts.push(amount.multiply(new Fraction(i * distributionPercent, 100)))
  }

  return [percents, amounts]
}
