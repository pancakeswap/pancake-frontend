import formatDuration from 'date-fns/formatDuration'
import differenceInWeeks from 'date-fns/differenceInWeeks'
import differenceInDays from 'date-fns/differenceInDays'
import addSeconds from 'date-fns/addSeconds'

export const secondsToWeeks = (seconds) => {
  const now = new Date()
  const addedDate = addSeconds(now, seconds)

  return differenceInWeeks(new Date(addedDate), now, { roundingMethod: 'round' })
}

export const secondsToDays = (seconds) => {
  const now = new Date()
  const addedDate = addSeconds(now, seconds)

  return differenceInDays(new Date(addedDate), now)
}

export const weeksToSeconds = (weeks) => weeks * 7 * 24 * 60 * 60

const formatSecondsToWeeks = (secondDuration) => formatDuration({ weeks: secondsToWeeks(secondDuration) })

export default formatSecondsToWeeks
