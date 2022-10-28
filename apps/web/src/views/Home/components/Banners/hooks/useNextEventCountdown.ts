import { useEffect, useState, useRef } from 'react'

const useNextEventCountdown = (nextEventTime: number): number => {
  const [secondsRemaining, setSecondsRemaining] = useState(null)
  const timer = useRef(null)

  useEffect(() => {
    const currentSeconds = Math.floor(Date.now() / 1000)
    const secondsRemainingCalc = Math.max(nextEventTime - currentSeconds, 0)
    setSecondsRemaining(secondsRemainingCalc)

    timer.current = setInterval(() => {
      setSecondsRemaining((prevSecondsRemaining) => Math.max(prevSecondsRemaining - 1, 0))
    }, 1000)

    return () => clearInterval(timer.current)
  }, [nextEventTime])

  return secondsRemaining
}

export default useNextEventCountdown
