import { useMemo } from 'react'
import { useCurrentBlockTimestamp } from './useCurrentBlockTimestamp'

export const useCheckIsUserAllowMigrate = (lockEndTime?: string) => {
  const currentTimestamp = useCurrentBlockTimestamp()
  const lockEndTimeAsNumber = useMemo(() => {
    return lockEndTime ? parseInt(lockEndTime) : 0
  }, [lockEndTime])
  const nextUTCThursdayTimeStamp = getNextUTCThursday(currentTimestamp)

  return lockEndTimeAsNumber > nextUTCThursdayTimeStamp
}

const getNextUTCThursday = (timestamp: number) => {
  const d = new Date(timestamp * 1000)
  d.setUTCDate(d.getUTCDate() + ((4 + 7 - d.getUTCDay()) % 7 || 7))
  d.setUTCHours(0)
  d.setUTCMinutes(0)
  d.setUTCSeconds(0)
  d.setUTCMilliseconds(0)
  return d.getTime() / 1000
}
