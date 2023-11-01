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

export function formatTimestamp(
  timestamp: number,
  {
    locale,
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
    showTimeZone = false,
    precision = Precision.MINUTE,
  }: Options = {},
) {
  const now = new Date(timestamp)
  const dateFormat: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
  const minuteFormat: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
  }
  const format =
    precision === Precision.MINUTE
      ? {
          ...dateFormat,
          ...minuteFormat,
        }
      : dateFormat
  const formatted = now.toLocaleString(locale, {
    ...format,
    timeZone,
  })

  if (!showTimeZone) {
    return formatted
  }
  return `${formatted} (${timeZone})`
}

export function formatUnixTimestamp(timestamp: number, options: Options) {
  return formatTimestamp(timestamp * 1000, options)
}
