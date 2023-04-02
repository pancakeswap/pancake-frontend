import { Percent, JSBI, Fraction, Price, Currency, CurrencyAmount } from '@pancakeswap/swap-sdk-core'

export function formatPercent(percent?: Percent, precision?: number) {
  return formatFraction(percent.asFraction.multiply(100), precision)
}

export function formatFraction(fraction?: Fraction, precision = 6) {
  if (!fraction) {
    return undefined
  }
  if (fraction.greaterThan(JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(precision)))) {
    return fraction.toFixed(0)
  }
  return fraction.toSignificant(precision)
}

export function formatPrice(price?: Price<Currency, Currency>, precision?: number) {
  return formatFraction(price?.asFraction.multiply(price?.scalar), precision)
}

export function formatAmount(amount?: CurrencyAmount<Currency>, precision?: number) {
  return formatFraction(
    amount?.asFraction.divide(JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(amount?.currency.decimals))),
    precision,
  )
}
