import { useEffect, useState } from 'react'

const useRoundEndCountdown = (endTime: number) => {
  const [secondsRemaining, setSecondsRemaining] = useState(null)
  const [startingSeconds, setStartingSeconds] = useState(Math.floor(Date.now() / 1000))

  useEffect(() => {
    const secondsRemainingCalc = endTime - startingSeconds
    setSecondsRemaining(secondsRemainingCalc)

    const tick = () => {
      setSecondsRemaining((prevSeconds) => prevSeconds + 1)
    }
    const timerInterval = setInterval(() => tick(), 1000)
    return () => clearInterval(timerInterval)
  }, [setSecondsRemaining, setStartingSeconds, startingSeconds, endTime])

  return secondsRemaining
}

export default useRoundEndCountdown
