import { CurrencyAmount, ETHER, JSBI } from '@pancakeswap/sdk'
import { MIN_BNB, BIG_INT_ZERO } from 'config/constants/exchange'

/**
 * Given some token amount, return the max that can be spent of it
 * @param currencyAmount to return max of
 */
export function maxAmountSpend(currencyAmount?: CurrencyAmount): CurrencyAmount | undefined {
  if (!currencyAmount) return undefined
  if (currencyAmount.currency === ETHER) {
    if (JSBI.greaterThan(currencyAmount.raw, MIN_BNB)) {
      return CurrencyAmount.ether(JSBI.subtract(currencyAmount.raw, MIN_BNB))
    }
    return CurrencyAmount.ether(BIG_INT_ZERO)
  }
  return currencyAmount
}
