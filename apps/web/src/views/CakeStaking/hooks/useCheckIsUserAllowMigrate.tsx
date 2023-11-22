import { useMemo } from 'react'

export const useCheckIsUserAllowMigrate = (lockEndTime?: string) => {
  const lockEndTimeAsNumber = useMemo(() => {
    return lockEndTime ? parseInt(lockEndTime) : 0
  }, [lockEndTime])
  const nextUTCThursdayTimeStamp = getNextUTCThursday()

  return lockEndTimeAsNumber > nextUTCThursdayTimeStamp
}

const getNextUTCThursday = () => {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() + ((4 + 7 - d.getUTCDay()) % 7 || 7))
  d.setUTCHours(0)
  d.setUTCMinutes(0)
  d.setUTCSeconds(0)
  d.setUTCMilliseconds(0)
  return d.getTime() / 1000
}
