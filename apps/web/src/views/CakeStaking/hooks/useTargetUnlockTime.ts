import { MAX_VECAKE_LOCK_WEEKS, WEEK } from 'config/constants/veCake'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { useCurrentBlockTimestamp } from './useCurrentBlockTimestamp'

// return a valid unlock time(should be UTC Thursday 00:00 ), with given duration seconds
export const useTargetUnlockTime = (duration: number, startFromTimestamp?: number) => {
  const currentBlockTimestamp = useCurrentBlockTimestamp()

  const maxUnlockTimestamp = useMemo(
    () => dayjs.unix(startFromTimestamp ?? currentBlockTimestamp).add(MAX_VECAKE_LOCK_WEEKS, 'weeks'),
    [currentBlockTimestamp, startFromTimestamp],
  )

  const target = useMemo(() => {
    const end = dayjs.unix(startFromTimestamp ?? currentBlockTimestamp).add(duration, 'seconds')
    return end.isBefore(maxUnlockTimestamp) ? end.unix() : maxUnlockTimestamp.unix()
  }, [currentBlockTimestamp, duration, maxUnlockTimestamp, startFromTimestamp])

  return useMemo(() => {
    return Math.floor(target / WEEK) * WEEK
  }, [target])
}
