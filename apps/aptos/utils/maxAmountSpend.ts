import { Currency, CurrencyAmount, JSBI } from '@pancakeswap/aptos-swap-sdk'
import { BIG_INT_ZERO, MIN_APT } from 'config/constants/exchange'
import { APTOS_COIN } from '@pancakeswap/awgmi'

/**
 * Given some token amount, return the max that can be spent of it
 * @param currencyAmount to return max of
 */
export function maxAmountSpend(currencyAmount?: CurrencyAmount<Currency>): CurrencyAmount<Currency> | undefined {
  if (!currencyAmount) return undefined

  if (currencyAmount.currency?.isNative || currencyAmount.currency?.address === APTOS_COIN) {
    if (JSBI.greaterThan(currencyAmount.quotient, MIN_APT)) {
      return CurrencyAmount.fromRawAmount(currencyAmount.currency, JSBI.subtract(currencyAmount.quotient, MIN_APT))
    }
    return CurrencyAmount.fromRawAmount(currencyAmount.currency, BIG_INT_ZERO)
  }
  return currencyAmount
}
