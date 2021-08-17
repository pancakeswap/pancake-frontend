const SECONDS_PER_MINUTE = 60
const SECONDS_PER_HOUR = 3600
const SECONDS_PER_DAY = 86400

// eslint-disable-next-line import/prefer-default-export
export const formatDuration = (duration: number, withSeconds?: boolean): string => {
  let remaining = duration
  const days = Math.floor(remaining / SECONDS_PER_DAY)
  remaining -= days * SECONDS_PER_DAY
  const hours = Math.floor(remaining / SECONDS_PER_HOUR)
  remaining -= hours * SECONDS_PER_HOUR
  const minutes = Math.floor(remaining / SECONDS_PER_MINUTE)
  if(duration < SECONDS_PER_MINUTE) {
    return `${duration}s`
  }

  if(withSeconds) {
    remaining -= minutes * SECONDS_PER_MINUTE
    return `${days}d ${hours}h ${minutes}m ${remaining}s`
  }

  return `${days}d ${hours}h ${minutes}m`
}

const displayInteger = (int: number): string => {
  if(int < 10) {
    return `0${int}`
  }
    return `${int}`
}
