import { useState, useEffect } from 'react'

export const useCurrentTime = () => {
  const [currentMs, setCurrentMs] = useState(new Date().getTime())


  const tick = () => {
    setCurrentMs(currentMs + 1000)
  }

  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000)
    return () => clearInterval(timerID)
  })

  return currentMs
}

export default useCurrentTime