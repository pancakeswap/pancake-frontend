import dayjs from 'dayjs'

export function formatTime(time: number | Date) {
  return dayjs(time).format('MMM D, YYYY HH:mm')
}

export function formatUnixTime(time: number) {
  return formatTime(dayjs.unix(time).toDate())
}
