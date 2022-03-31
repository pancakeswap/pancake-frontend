import { useState, useCallback, memo, useMemo } from 'react'
import useInterval from 'hooks/useInterval'

import getTimePeriods from 'utils/getTimePeriods'
import addSeconds from 'date-fns/addSeconds'
import differenceInSeconds from 'date-fns/differenceInSeconds'
import convertLockTimeToSeconds from '../utils/convertLockTimeToSeconds'

interface PropsType {
  lockEndTime: string
}

const BurningCountDown: React.FC<PropsType> = ({ lockEndTime }) => {
  const [remainingSeconds, setRemainingSeconds] = useState(0)

  // 1 week after lockEndTime
  const burnDate = useMemo(() => addSeconds(convertLockTimeToSeconds(lockEndTime), 604800), [lockEndTime])

  const updateRemainingSeconds = useCallback(() => {
    setRemainingSeconds(differenceInSeconds(burnDate, new Date()))
  }, [burnDate])

  // Update every minute
  useInterval(updateRemainingSeconds, 1000 * 60)

  const { days, hours, minutes } = getTimePeriods(remainingSeconds)

  return <>{`${days}d: ${hours}h: ${minutes}m`}</>
}

export default memo(BurningCountDown)
