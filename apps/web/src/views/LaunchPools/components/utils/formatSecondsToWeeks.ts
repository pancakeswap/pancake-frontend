import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(duration)
dayjs.extend(relativeTime)

export const secondsToWeeks = (seconds) => {
  const now = dayjs()
  const addedDate = now.add(seconds, 'seconds')

  return Math.round(addedDate.diff(now, 'weeks', true))
}

export const secondsToDays = (seconds) => {
  const now = dayjs()
  const addedDate = now.add(seconds, 'seconds')

  return addedDate.diff(now, 'days')
}

export const weeksToSeconds = (weeks) => weeks * 7 * 24 * 60 * 60

const formatSecondsToWeeks = (secondDuration) =>
  `${dayjs.duration(secondsToWeeks(secondDuration), 'weeks').asWeeks()} weeks`

export default formatSecondsToWeeks
