import { useEffect, useState, useRef } from 'react'

const useNextEventCountdown = (nextEventTime?: number): number => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0)
  const timer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    const currentSeconds = Math.floor(Date.now() / 1000)
    const secondsRemainingCalc = nextEventTime ? Math.max(nextEventTime - currentSeconds, 0) : 0
    setSecondsRemaining(secondsRemainingCalc)

    timer.current = setInterval(() => {
      setSecondsRemaining((prevSecondsRemaining) => (prevSecondsRemaining ? Math.max(prevSecondsRemaining - 1, 0) : 0))
    }, 1000)

    return () => {
      if (timer.current) {
        clearInterval(timer.current)
      }
    }
  }, [nextEventTime])

  return secondsRemaining
}

export default useNextEventCountdown
