import dayjs from 'dayjs'

export function formatTime(time: number | Date) {
  return dayjs(time).format('MMM D, YYYY HH:mm')
}
