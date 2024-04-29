import { Currency } from '@pancakeswap/swap-sdk-core'

/**
 * returns the currencies in sorted order
 */
export const getSortedCurrencies = (currencyA: Currency, currencyB: Currency) => {
  let currency0: Currency
  let currency1: Currency
  if (currencyA.isNative || currencyB.isNative) {
    ;[currency0, currency1] = currencyA.isNative ? [currencyA, currencyB] : [currencyB, currencyA]
  } else {
    ;[currency0, currency1] = currencyA.sortsBefore(currencyB) ? [currencyA, currencyB] : [currencyB, currencyA]
  }
  return [currency0, currency1]
}
