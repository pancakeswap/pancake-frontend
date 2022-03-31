import secondsToHours from 'date-fns/secondsToHours'
import daysToWeeks from 'date-fns/daysToWeeks'
import compose from 'lodash/fp/compose'
import formatDuration from 'date-fns/formatDuration'

export const secondsToWeeks = compose(daysToWeeks, (hours) => hours / 24, secondsToHours)

export const weeksToSeconds = (weeks) => weeks * 7 * 24 * 60 * 60

const formatSecondsToWeeks = (secondDuration) => formatDuration({ weeks: secondsToWeeks(secondDuration) })

export default formatSecondsToWeeks
