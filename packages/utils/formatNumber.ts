import BigNumber from 'bignumber.js'

const ZERO = new BigNumber(0)
const ONE = new BigNumber(1)
const TEN = new BigNumber(10)

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

function getDigits(value: BigNumber) {
  return [getIntegerDigits(value), value.decimalPlaces() ?? 0]
}

type Options = {
  maximumSignificantDigits?: number
  roundingMode?: BigNumber.RoundingMode
}

export function formatNumber(
  value: string | number | BigNumber,
  { maximumSignificantDigits = 12, roundingMode = BigNumber.ROUND_DOWN }: Options = {},
) {
  const valueInBN = new BigNumber(value)
  if (valueInBN.eq(ZERO)) {
    return valueInBN.toString()
  }
  const [integerDigits, decimalDigits] = getDigits(valueInBN)
  const totalDigits = integerDigits + decimalDigits
  const maxDigits = Math.min(totalDigits, maximumSignificantDigits)
  const { max, min } = {
    max: TEN.exponentiatedBy(maximumSignificantDigits).minus(1),
    min: ONE.div(TEN.exponentiatedBy(maximumSignificantDigits - 1)),
  }
  const isGreaterThanMax = valueInBN.gt(max)
  const isLessThanMin = valueInBN.lt(min)
  const bnToDisplay = isGreaterThanMax ? max : isLessThanMin ? min : valueInBN
  const digitsAvailable = maxDigits - integerDigits
  const decimalDisplayDigits = digitsAvailable < 0 ? 0 : digitsAvailable
  const valueToDisplay = bnToDisplay.toFormat(decimalDisplayDigits, roundingMode, DEFAULT_FORMAT_CONFIG)
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
