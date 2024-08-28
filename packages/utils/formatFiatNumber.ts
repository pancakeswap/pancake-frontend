import BigNumber from 'bignumber.js'
import { BIG_ONE, BIG_TEN } from './bigNumber'
import { formatNumber } from './formatNumber'

export const valueWithSymbol = (val: number | string, fiatSymbol: string) => `${fiatSymbol} ${val}`

type Options = {
  maximumSignificantDigits?: number
  roundingMode?: BigNumber.RoundingMode
  maxDecimalDisplayDigits?: number
}

export function formatFiatNumber(
  value: string | number | BigNumber,
  fiatSymbol: string = '$',
  { maximumSignificantDigits = 8, roundingMode = BigNumber.ROUND_DOWN, maxDecimalDisplayDigits = 2 }: Options = {},
) {
  const bnValue = new BigNumber(value)
  if (bnValue.eq(0)) {
    return valueWithSymbol(0, fiatSymbol)
  }
  const maximum = BIG_TEN.exponentiatedBy(maximumSignificantDigits).minus(1)
  const minimum = BIG_ONE.div(new BigNumber(10).exponentiatedBy(maximumSignificantDigits - 1))
  // If less than minimum, just display <0.01
  if (bnValue.lt(minimum)) {
    return `<${valueWithSymbol('0.01', fiatSymbol)}`
  }
  // If greater than maximum, format to shorthand
  if (bnValue.gt(maximum)) {
    const million = 1e6
    const billion = 1e9
    const trillion = 1e12
    if (bnValue.isGreaterThanOrEqualTo(trillion)) {
      return `>${valueWithSymbol('999B', fiatSymbol)}`
    }
    if (bnValue.isGreaterThanOrEqualTo(billion)) {
      return valueWithSymbol(`${bnValue.dividedBy(billion).toFixed(0, BigNumber.ROUND_DOWN)}B`, fiatSymbol)
    }
    if (bnValue.isGreaterThanOrEqualTo(million)) {
      return valueWithSymbol(`${bnValue.dividedBy(million).toFixed(0, BigNumber.ROUND_DOWN)}M`, fiatSymbol)
    }
  }
  // If less than 1, keep as many decimal digits as possible
  if (bnValue.lt(1)) {
    return `${fiatSymbol} ${formatNumber(value, {
      maximumSignificantDigits,
      roundingMode,
    })}`
  }
  // Otherwise, keep more integers and 2 decimals
  return `${fiatSymbol} ${formatNumber(value, {
    maximumSignificantDigits,
    roundingMode,
    maxDecimalDisplayDigits,
  })}`
}
