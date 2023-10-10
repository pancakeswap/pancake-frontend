import dayjs from 'dayjs'

export function formatTime(time: number | Date) {
  return dayjs(time).format('MMM d, YYYY HH:mm')
}
