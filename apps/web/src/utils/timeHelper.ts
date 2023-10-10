import dayjs from 'dayjs'

export const secondsToDay = (s: number) => Math.floor(s / (24 * 60 * 60))

export const convertTimeToMilliseconds = (time: string): number => {
  return parseInt(time) * 1000
}

export const distanceToNowStrict = (timeInMilliSeconds: number) => {
  const endTime = new Date(timeInMilliSeconds)
  return new Date() > endTime || !Number.isFinite(timeInMilliSeconds)
    ? `0 seconds`
    : `${dayjs.duration(dayjs(endTime).diff(dayjs(), 'days'), 'days').asDays()} days`
}
