import { format } from 'date-fns'

export function formatTime(time: number | Date) {
  return format(time, 'MMM d, yyyy HH:mm')
}
