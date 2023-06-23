import { Percent, Fraction, Price, Currency, CurrencyAmount } from '@pancakeswap/swap-sdk-core'

export function formatPercent(percent?: Percent, precision?: number) {
  return percent ? formatFraction(percent.asFraction.multiply(100), precision) : undefined
}

export function formatFraction(fraction?: Fraction | null | undefined, precision: number | undefined = 6) {
  if (!fraction || fraction.denominator === 0n) {
    return undefined
  }
  if (fraction.greaterThan(10n ** BigInt(precision))) {
    return fraction.toFixed(0)
  }
  return fraction.toSignificant(precision)
}

export function formatPrice(price?: Price<Currency, Currency> | null | undefined, precision?: number | undefined) {
  if (!price) {
    return undefined
  }
  return formatFraction(price?.asFraction.multiply(price?.scalar), precision)
}

export function formatAmount(amount?: CurrencyAmount<Currency> | null | undefined, precision?: number | undefined) {
  if (!amount) {
    return undefined
  }
  return formatFraction(amount?.asFraction.divide(10n ** BigInt(amount?.currency.decimals)), precision)
}

export function parseNumberToFraction(num: number, precision = 6) {
  if (Number.isNaN(num) || !Number.isFinite(num)) {
    return undefined
  }
  const scalar = 10 ** precision
  return new Fraction(BigInt(Math.floor(num * scalar)), BigInt(scalar))
}
