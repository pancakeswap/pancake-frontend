import { Currency, CurrencyAmount, Fraction, JSBI, Price } from '@pancakeswap/sdk'
import formatLocaleNumber from './formatLocaleNumber'

export function formatCurrencyAmount(
  amount: CurrencyAmount<Currency> | undefined,
  sigFigs: number,
  locale: string,
  fixedDecimals?: number,
): string {
  if (!amount) {
    return '-'
  }

  if (JSBI.equal(amount.quotient, JSBI.BigInt(0))) {
    return '0'
  }

  if (amount.divide(amount.decimalScale).lessThan(new Fraction(1, 100000))) {
    return `<${formatLocaleNumber({ number: 0.00001, locale })}`
  }

  return formatLocaleNumber({ number: amount, locale, sigFigs, fixedDecimals })
}

export function formatPrice(price: Price<Currency, Currency> | undefined, sigFigs: number, locale: string): string {
  if (!price) {
    return '-'
  }

  if (parseFloat(price.toFixed(sigFigs)) < 0.0001) {
    return `<${formatLocaleNumber({ number: 0.00001, locale })}`
  }

  return formatLocaleNumber({ number: price, locale, sigFigs })
}
