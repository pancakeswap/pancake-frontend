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

export function formatFiatNumber({
  value,
  locale,
  fiatCurrencyCode,
  options = {},
}: {
  value: string | number | BigNumber
  locale: string | undefined
  fiatCurrencyCode: string
  options?: Omit<Intl.NumberFormatOptions, 'currency' | 'style' | 'minimumFractionDigits' | 'maximumFractionDigits'>
}) {
  let numberString: number | undefined

  if (typeof value === 'number') numberString = value
  else numberString = Number.parseFloat(Number(value).toFixed(2))

  const formattedNumber = numberString.toLocaleString(locale, {
    ...options,
    style: 'currency',
    currency: fiatCurrencyCode.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const currencySymbol = formattedNumber[0]
  const currencyNumberValue = Number.parseFloat(formattedNumber.slice(1).replace(/,/g, ''))

  const valueInBN = new BigNumber(currencyNumberValue)
  if (valueInBN.eq(ZERO)) return `${currencySymbol}${valueInBN}`

  const valueToDisplay = formatLargeFiatValue(valueInBN, currencySymbol)
  return valueToDisplay
}

export function formatNumberWithFullDigits(
  value: string | number | BigNumber,
  options?: Omit<Options, 'maximumSignificantDigits'>,
) {
  const valueInBN = new BigNumber(value)
  return formatNumber(valueInBN, { ...options, maximumSignificantDigits: getTotalDigits(valueInBN) })
}

function formatLargeFiatValue(numericValue: BigNumber, currencySymbol: string): string {
  const formattedValue = numericValue.toString()

  if (numericValue.gt(BigNumber(10_000)) && numericValue.lt(BigNumber(1_000_000))) {
    return `> ${currencySymbol}${numericValue.div(1000).toFixed(0)}K`
  }
  if (numericValue.gt(BigNumber(1_000_000))) {
    return `> ${currencySymbol}${numericValue.div(1_000_000).toFixed(0)}M`
  }

  return `${currencySymbol}${formattedValue}`
}
