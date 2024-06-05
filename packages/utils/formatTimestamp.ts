import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export enum Precision {
  DATE,
  MINUTE,
}

interface Options {
  locale?: string
  timeZone?: string

  showTimeZone?: boolean
  precision?: Precision
}

function getTimeFormat(precision: Precision = Precision.MINUTE) {
  const minuteFormat = 'MMM D, YYYY HH:mm'
  switch (precision) {
    case Precision.DATE:
      return 'MMM D, YYYY'
    case Precision.MINUTE:
      return minuteFormat
    default:
      return minuteFormat
  }
}

export function formatTimestamp(
  timestamp: number,
  {
    locale,
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
    showTimeZone = false,
    precision,
  }: Options = {},
) {
  const formatted = dayjs(timestamp)
    .tz(timeZone)
    .locale(locale || 'en')
    .format(getTimeFormat(precision))

  if (!showTimeZone) {
    return formatted
  }
  return `${formatted} (${timeZone})`
}

export function formatUnixTimestamp(timestamp: number, options?: Options) {
  return formatTimestamp(timestamp * 1000, options)
}
