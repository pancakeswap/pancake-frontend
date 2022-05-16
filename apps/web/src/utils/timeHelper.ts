import { formatDistanceToNowStrict } from 'date-fns'

export const secondsToDay = (s: number) => Math.floor(s / (24 * 60 * 60))

export const convertTimeToSeconds = (time: string): number => {
  return parseInt(time) * 1000
}

// https://date-fns.org/v2.28.0/docs/formatDistanceToNowStrict
export const distanceToNowStrict = (timeInSeconds: number) => {
  const endTime = new Date(timeInSeconds)
  return new Date() > endTime || !Number.isFinite(timeInSeconds) ? `0 seconds` : formatDistanceToNowStrict(endTime)
}
