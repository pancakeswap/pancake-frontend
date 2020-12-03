import { useState, useEffect } from 'react'

export const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(Date.now())

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