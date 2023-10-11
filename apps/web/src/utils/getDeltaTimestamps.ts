import dayjs from 'dayjs'

/**
 * Returns UTC timestamps for 24h ago, 48h ago, 7d ago and 14d ago relative to current date and time
 */
export const getDeltaTimestamps = (): [number, number, number, number] => {
  const currentTime = dayjs()
  const t24h = currentTime.subtract(1, 'days').startOf('minutes').unix()
  const t48h = currentTime.subtract(2, 'days').startOf('minutes').unix()
  const t7d = currentTime.subtract(1, 'weeks').startOf('minutes').unix()
  const t14d = currentTime.subtract(2, 'weeks').startOf('minutes').unix()
  return [t24h, t48h, t7d, t14d]
}
