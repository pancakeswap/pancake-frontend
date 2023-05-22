// Returns first 2 digits after first non-zero decimal
// i.e. 0.001286 -> 0.0012, 0.9845 -> 0.98, 0.0102 -> 0.010, etc
// Intended to be used for tokens whose value is less than $1
// https://stackoverflow.com/a/23887837
export const getFirstThreeNonZeroDecimals = (value: number) => {
  return value.toFixed(9).match(/^-?\d*\.?0*\d{0,2}/)?.[0]
}

export type formatAmountNotation = 'compact' | 'standard'

export type tokenPrecisionStyle = 'normal' | 'enhanced'

const GROUPING_FALSE_LARGER_THAN_THIS = 1_000_000_000_000_000_000

/**
 * This function is used to format token prices, liquidity, amount of tokens in TX, and in general any numbers on info section
 * @param amount - amount to be formatted
 * @param notation - whether to show 1M or 1,000,000
 * @param displayThreshold - threshold below which it will return simply <displayThreshold instead of actual value, e.g. if 0.001 -> returns <0.001 for 0.0005
 * @param tokenPrecision - set to 'normal' when you want precision to be 3 decimals for values < 1 and 2 decimals for values > 1, 'enhanced' option always use 3 decimals
 * @param isInteger - if true the values will contain decimal part only if the amount is > 1000
 * @returns formatted string ready to be displayed
 */
export const formatAmount = (
  amount: number | undefined,
  options?: {
    notation?: formatAmountNotation
    displayThreshold?: number
    tokenPrecision?: tokenPrecisionStyle
    isInteger?: boolean
  },
) => {
  const {
    notation = amount && amount >= 10000 ? 'compact' : 'standard',
    displayThreshold,
    tokenPrecision,
    isInteger,
  } = options || { notation: amount && amount >= 10000 ? 'compact' : 'standard' }
  if (amount === 0) {
    if (isInteger) {
      return '0'
    }
    return '0.00'
  }
  if (!amount) return '-'
  if (!Number.isFinite(amount)) return '∞'
  if (displayThreshold && amount < displayThreshold) {
    return `<${displayThreshold}`
  }
  if (amount < 1 && !tokenPrecision) {
    return getFirstThreeNonZeroDecimals(amount)
  }

  let precision = 2
  if (tokenPrecision) {
    precision = amount < 1 || tokenPrecision === 'enhanced' ? 3 : 2
  }

  const amountWithPrecision = parseFloat(amount?.toFixed(precision))

  return Intl.NumberFormat('en-US', {
    notation,
    minimumFractionDigits: isInteger && amount < 1000 ? 0 : precision,
    maximumFractionDigits: isInteger && amount < 1000 ? 0 : precision,
    useGrouping: amountWithPrecision < GROUPING_FALSE_LARGER_THAN_THIS,
  }).format(amountWithPrecision)
}
