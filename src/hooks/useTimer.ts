import { useState, useEffect } from 'react'

export const useCurrentTime = () => {
  const [currentMillis, setCurrentMillis] = useState(new Date().getTime())

  useEffect(() => {
    const tick = () => {
      setCurrentMillis((prevMillis) => prevMillis + 1000)
    }

    const timerID = setInterval(() => tick(), 1000)

    return () => clearInterval(timerID)
  }, [])

  return currentMillis
}

export default useCurrentTime
