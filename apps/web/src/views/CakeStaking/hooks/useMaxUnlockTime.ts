import { MAX_VECAKE_LOCK_WEEKS, WEEK } from 'config/constants/veCake'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { useCurrentBlockTimestamp } from './useCurrentBlockTimestamp'

export const useMaxUnlockTime = (durationSeconds: number, prevUnlockTimestamp: number = 0) => {
  const currentBlockTimestamp = useCurrentBlockTimestamp()
  const maxUnlockTimestamp = useMemo(
    () => dayjs.unix(prevUnlockTimestamp ?? currentBlockTimestamp).add(MAX_VECAKE_LOCK_WEEKS, 'weeks'),
    [currentBlockTimestamp, prevUnlockTimestamp],
  )

  return useMemo(() => {
    // if not staked before, max unlock time is max weeks
    if (prevUnlockTimestamp === 0) return maxUnlockTimestamp.unix()

    const currentWeeks = Math.floor(currentBlockTimestamp / WEEK)
    const target = dayjs.unix(prevUnlockTimestamp).add(durationSeconds, 'seconds').unix()

    const prevWeeks = Math.floor(prevUnlockTimestamp / WEEK)
    const leftWeeks = MAX_VECAKE_LOCK_WEEKS - (prevWeeks - currentWeeks)

    let targetWeeks = Math.floor(target / WEEK)

    if (targetWeeks - currentWeeks > leftWeeks) targetWeeks = currentWeeks + leftWeeks
    return targetWeeks * WEEK
  }, [currentBlockTimestamp, durationSeconds, maxUnlockTimestamp, prevUnlockTimestamp])
}

export const useMaxUnlockWeeks = (weeksToLock: number, prevUnlockTimestamp: number = 0) => {
  const currentBlockTimestamp = useCurrentBlockTimestamp()
  const maxUnlockTime = useMaxUnlockTime(weeksToLock * WEEK, prevUnlockTimestamp)

  return useMemo(() => {
    if (!prevUnlockTimestamp) return MAX_VECAKE_LOCK_WEEKS
    if (maxUnlockTime > currentBlockTimestamp)
      return Math.floor(maxUnlockTime / WEEK) - Math.floor(currentBlockTimestamp / WEEK)
    return 0
  }, [currentBlockTimestamp, maxUnlockTime, prevUnlockTimestamp])
}
