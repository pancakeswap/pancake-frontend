import { useState, useEffect } from 'react'

export const useCurrentTime = () => {
  const [currentMillis, setCurrentMillis] = useState(new Date().getTime())


  const tick = () => {
    setCurrentMillis(currentMillis + 1000)
  }

  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000)
    return () => clearInterval(timerID)
  })

  return currentMillis
}

export default useCurrentTime