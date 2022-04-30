import { formatDistanceToNowStrict } from 'date-fns'

export const secondsToDay = (s: number) => Math.floor(s / (24 * 60 * 60))

export const convertTimeToSeconds = (time: string): number => {
  return parseInt(time) * 1000
}

// https://date-fns.org/v2.28.0/docs/formatDistanceToNowStrict
export const distanceToNowStrict = (timestamp: string) => {
  const endTime = new Date(convertTimeToSeconds(timestamp))
  return new Date() > endTime || timestamp === null ? `0 seconds` : formatDistanceToNowStrict(endTime)
}
