import { useMemo } from 'react'

const WEEK_IN_SECONDS = 604800

export const useCheckIsUserAllowMigrate = (lockEndTime?: string) => {
  const lockEndTimeAsNumber = useMemo(() => {
    return lockEndTime ? parseInt(lockEndTime) : 0
  }, [lockEndTime])

  return !(Math.floor(lockEndTimeAsNumber / WEEK_IN_SECONDS) * WEEK_IN_SECONDS < Date.now() / 1000)
}
