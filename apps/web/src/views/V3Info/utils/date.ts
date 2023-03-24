import dayjs from 'dayjs'

export function unixToDate(unix: number, format = 'YYYY-MM-DD'): string {
  return dayjs.unix(unix).utc().format(format)
}

export const formatTime = (unix: string, buffer?: number) => {
  const now = dayjs()
  const timestamp = dayjs.unix(parseInt(unix)).add(buffer ?? 0, 'minute')

  const inSeconds = now.diff(timestamp, 'second')
  const inMinutes = now.diff(timestamp, 'minute')
  const inHours = now.diff(timestamp, 'hour')
  const inDays = now.diff(timestamp, 'day')

  if (inMinutes < 1) {
    return 'recently'
  }

  if (inHours >= 24) {
    return `${inDays} ${inDays === 1 ? 'day' : 'days'} ago`
  }
  if (inMinutes >= 60) {
    return `${inHours} ${inHours === 1 ? 'hour' : 'hours'} ago`
  }
  if (inSeconds >= 60) {
    return `${inMinutes} ${inMinutes === 1 ? 'minute' : 'minutes'} ago`
  }
  return `${inSeconds} ${inSeconds === 1 ? 'second' : 'seconds'} ago`
}
