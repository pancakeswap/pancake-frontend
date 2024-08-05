import dayjs from 'dayjs'

export const combineDateAndTime = (date: Date | null, time: Date | null) => {
  const dateDayJs = dayjs(date)
  const timeDayJs = dayjs(time)
  if (!dateDayJs.isValid() || !timeDayJs.isValid()) {
    return null
  }

  const dateStr = dateDayJs.format('YYYY-MM-DD')
  const timeStr = timeDayJs.format('HH:mm:ss')

  return dayjs(`${dateStr}T${timeStr}`).unix()
}

export const convertDateAndTime = (timestamp: number) => {
  const time = dayjs(timestamp * 1000) // To milliseconds
  const dateStr = time.format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (z)')
  return dateStr
}

export const convertTimestampToDate = (timestamp: number, format?: string) => {
  const time = dayjs(timestamp * 1000) // To milliseconds
  const dateStr = time.format(format ?? 'YYYY/MM/DD HH:mm')
  return dateStr
}
