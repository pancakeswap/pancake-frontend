import dayjs from 'dayjs'

// Returns unix timestamp rounded down to nearest hour
const getLatestUnixHour = (date?: Date) => {
  return dayjs(date ?? new Date())
    .startOf('hour')
    .unix()
}

export default getLatestUnixHour
