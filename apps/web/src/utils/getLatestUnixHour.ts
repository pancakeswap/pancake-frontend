import { ONE_HOUR_SECONDS } from 'config/constants/info'
import { getUnixTime } from 'date-fns'

// Returns unix timestamp rounded down to nearest hour
const getLatestUnixHour = (date?: Date) => {
  const nowUnixTime = getUnixTime(date ?? new Date())
  const remainder = nowUnixTime % ONE_HOUR_SECONDS
  return nowUnixTime - remainder
}

export default getLatestUnixHour
