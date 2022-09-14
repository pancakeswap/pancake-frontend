import { useState, useCallback, memo, useMemo } from 'react'
import { useInterval } from '@pancakeswap/hooks'

import getTimePeriods from 'utils/getTimePeriods'
import { UNLOCK_FREE_DURATION } from 'config/constants/pools'
import addSeconds from 'date-fns/addSeconds'
import differenceInSeconds from 'date-fns/differenceInSeconds'
import { convertTimeToSeconds } from 'utils/timeHelper'

interface PropsType {
  lockEndTime: string
}

const BurningCountDown: React.FC<React.PropsWithChildren<PropsType>> = ({ lockEndTime }) => {
  const [remainingSeconds, setRemainingSeconds] = useState(0)

  // 1 week after lockEndTime
  const burnDate = useMemo(() => addSeconds(convertTimeToSeconds(lockEndTime), UNLOCK_FREE_DURATION), [lockEndTime])

  const updateRemainingSeconds = useCallback(() => {
    setRemainingSeconds(differenceInSeconds(burnDate, new Date()))
  }, [burnDate])

  // Update every minute
  useInterval(updateRemainingSeconds, 1000 * 60)

  const { days, hours, minutes } = getTimePeriods(remainingSeconds)

  return <>{`${days}d: ${hours}h: ${minutes}m`}</>
}

export default memo(BurningCountDown)
