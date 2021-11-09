import { getUnixTime } from 'date-fns'

// Returns unix timestamp rounded down to nearest hour
const getLatestUnixHour = (date?: Date) => {
  const nowUnixTime = getUnixTime(date ?? new Date())
  const remainder = nowUnixTime % 3600
  return nowUnixTime - remainder
}

export default getLatestUnixHour
