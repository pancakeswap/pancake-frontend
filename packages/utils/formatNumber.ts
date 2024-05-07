import BigNumber from 'bignumber.js'

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
  return getIntegerDigits(value) + (value.decimalPlaces() ?? 0)
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
  const { max, min } = {
    max: TEN.exponentiatedBy(maximumSignificantDigits + 1).minus(1),
    min: ONE.div(TEN.exponentiatedBy(maximumSignificantDigits - 1)),
  }
  const isGreaterThanMax = valueInBN.gt(max)
  const isLessThanMin = valueInBN.lt(min)
  const bnToDisplay = isGreaterThanMax ? max : isLessThanMin ? min : valueInBN
  const integerDigits = getIntegerDigits(bnToDisplay)
  const digitsAvailable = maximumSignificantDigits - integerDigits
  const decimalDigits = digitsAvailable < 0 ? 0 : digitsAvailable
  const valueToDisplay = bnToDisplay.toFormat(decimalDigits, roundingMode, DEFAULT_FORMAT_CONFIG)
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
