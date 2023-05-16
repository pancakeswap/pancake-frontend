import { Currency, CurrencyAmount } from '@pancakeswap/sdk'
import { BIG_INT_ZERO, MIN_BNB } from 'config/constants/exchange'

/**
 * Given some token amount, return the max that can be spent of it
 * @param currencyAmount to return max of
 */
export function maxAmountSpend(currencyAmount?: CurrencyAmount<Currency>): CurrencyAmount<Currency> | undefined {
  if (!currencyAmount) return undefined
  if (currencyAmount.currency?.isNative) {
    if (currencyAmount.quotient > MIN_BNB) {
      return CurrencyAmount.fromRawAmount(currencyAmount.currency, currencyAmount.quotient - MIN_BNB)
    }
    return CurrencyAmount.fromRawAmount(currencyAmount.currency, BIG_INT_ZERO)
  }
  return currencyAmount
}
