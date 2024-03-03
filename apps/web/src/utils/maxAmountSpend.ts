import { Currency, CurrencyAmount } from '@pancakeswap/sdk'
import { BIG_INT_ZERO, MIN_BNB } from 'config/constants/exchange'

type NullableCurrencyAmount = CurrencyAmount<Currency> | undefined

/**
 * Given some token amount, return the max that can be spent of it
 * @param currencyAmount to return max of
 */
export function maxAmountSpend<T extends NullableCurrencyAmount>(currencyAmount?: T): T {
  if (!currencyAmount) return undefined as T
  if (currencyAmount.currency?.isNative) {
    if (currencyAmount.quotient > MIN_BNB) {
      return CurrencyAmount.fromRawAmount(currencyAmount.currency, currencyAmount.quotient - MIN_BNB) as T
    }
    return CurrencyAmount.fromRawAmount(currencyAmount.currency, BIG_INT_ZERO) as T
  }
  return currencyAmount
}
