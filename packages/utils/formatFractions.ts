import { Percent, Fraction, Price, Currency, CurrencyAmount } from '@pancakeswap/swap-sdk-core'

export function formatPercent(percent?: Percent, precision?: number) {
  return percent ? formatFraction(percent.asFraction.multiply(100), precision) : undefined
}

export function formatFraction(fraction?: Fraction, precision = 6) {
  if (!fraction) {
    return undefined
  }
  if (fraction.greaterThan(10n ** BigInt(precision))) {
    return fraction.toFixed(0)
  }
  return fraction.toSignificant(precision)
}

export function formatPrice(price?: Price<Currency, Currency>, precision?: number) {
  return formatFraction(price?.asFraction.multiply(price?.scalar), precision)
}

export function formatAmount(amount?: CurrencyAmount<Currency>, precision?: number) {
  return formatFraction(amount?.asFraction.divide(10n ** BigInt(amount?.currency.decimals)), precision)
}

export function parseNumberToFraction(num: number, precision = 6) {
  const scalar = 10 ** precision
  return new Fraction(BigInt(Math.floor(num * scalar)), BigInt(scalar))
}
