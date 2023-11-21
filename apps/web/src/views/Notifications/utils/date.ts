import dayjs from 'dayjs'

export const formatTime = (unix: string, buffer?: number) => {
  const now = dayjs()
  const timestamp = dayjs.unix(parseInt(unix)).add(buffer ?? 0, 'minute')

  const inSeconds = now.diff(timestamp, 'second')
  const inMinutes = now.diff(timestamp, 'minute')
  const inHours = now.diff(timestamp, 'hour')
  const inDays = now.diff(timestamp, 'day')

  if (inHours >= 24) {
    return `${inDays}d ago`
  }
  if (inMinutes >= 60) {
    return `${inHours}hr ago`
  }
  if (inSeconds >= 60) {
    return `${inMinutes}m ago`
  }
  return `less than 1m ago`
}
