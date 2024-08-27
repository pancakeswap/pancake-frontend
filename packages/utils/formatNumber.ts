import BigNumber from 'bignumber.js'
import { BIG_ZERO, BIG_ONE, BIG_TEN } from './bigNumber'

const DEFAULT_FORMAT_CONFIG = {
  prefix: '',
  decimalSeparator: '.',
  groupSeparator: ',',
  groupSize: 3,
  secondaryGroupSize: 0,
  fractionGroupSeparator: ' ',
  fractionGroupSize: 0,
  suffix: '',
}

function getIntegerDigits(value: BigNumber) {
  return value.integerValue(BigNumber.ROUND_DOWN).sd(true)
}

function getTotalDigits(value: BigNumber) {
  const [integerDigits, decimalDigits] = getDigits(value)
  return integerDigits + decimalDigits
}

export function getDigits(value: BigNumber) {
  return [getIntegerDigits(value), value.decimalPlaces() ?? 0]
}

type Options = {
  maximumSignificantDigits?: number
  roundingMode?: BigNumber.RoundingMode
  maxDecimalDisplayDigits?: number
}

export function formatNumber(
  value: string | number | BigNumber,
  { maximumSignificantDigits = 12, roundingMode = BigNumber.ROUND_DOWN, maxDecimalDisplayDigits }: Options = {},
) {
  const valueInBN = new BigNumber(value)
  if (valueInBN.eq(BIG_ZERO)) {
    return valueInBN.toString()
  }
  const [integerDigits, decimalDigits] = getDigits(valueInBN)
  const totalDigits = integerDigits + decimalDigits
  const maxDigits = Math.min(totalDigits, maximumSignificantDigits)
  const { max, min } = {
    max: BIG_TEN.exponentiatedBy(maximumSignificantDigits).minus(1),
    min: BIG_ONE.div(BIG_TEN.exponentiatedBy(maximumSignificantDigits - 1)),
  }
  const isGreaterThanMax = valueInBN.gt(max)
  const isLessThanMin = valueInBN.lt(min)
  const bnToDisplay = isGreaterThanMax ? max : isLessThanMin ? min : valueInBN
  const digitsAvailable = Math.min(maxDecimalDisplayDigits ?? maxDigits, maxDigits - integerDigits)
  const decimalPlaces = digitsAvailable < 0 ? 0 : digitsAvailable
  const valueToDisplay = bnToDisplay.toFormat(decimalPlaces, roundingMode, DEFAULT_FORMAT_CONFIG)
  const limitIndicator = isGreaterThanMax ? '>' : isLessThanMin ? '<' : ''
  return `${limitIndicator}${valueToDisplay}`
}

export function formatNumberWithFullDigits(
  value: string | number | BigNumber,
  options?: Omit<Options, 'maximumSignificantDigits'>,
) {
  const valueInBN = new BigNumber(value)
  return formatNumber(valueInBN, { ...options, maximumSignificantDigits: getTotalDigits(valueInBN) })
}
