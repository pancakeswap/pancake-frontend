import dayjs from 'dayjs'
import { useCallback, useEffect, useState } from 'react'

type Countdown = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

// @param to The target unix timestamp
export function useCountdown(to: number): Countdown | undefined {
  const [countdown, setCountdown] = useState<Countdown | undefined>()

  const updateCountdown = useCallback((): ReturnType<typeof setTimeout> | void => {
    const target = dayjs.unix(to)
    let relative = dayjs()
    if (target.isBefore(relative)) {
      return setCountdown(undefined)
    }

    const days = target.diff(relative, 'day')
    relative = relative.add(days, 'day')
    const hours = target.diff(relative, 'hour')
    relative = relative.add(hours, 'hour')
    const minutes = target.diff(relative, 'minute')
    relative = relative.add(minutes, 'minute')
    const seconds = target.diff(relative, 'second')
    setCountdown({
      days,
      hours,
      minutes,
      seconds,
    })
    return setTimeout(updateCountdown, 1000)
  }, [to])

  useEffect(() => {
    const timer = updateCountdown()
    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [updateCountdown])

  return countdown
}
