import { useState, useEffect } from 'react'
import { getUtcTimeNow } from '../views/Lottery/helpers/CountdownHelpers'

export const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(getUtcTimeNow(new Date()))

  const tick = () => {
    setCurrentTime(currentTime + 1000)
  }

  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000)
    return () => clearInterval(timerID)
  })

  return currentTime
}

export default useCurrentTime