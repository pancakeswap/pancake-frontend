import { useEffect, useState } from 'react'

const useNextEventCountdown = (nextEventTime: number): number => {
  const [secondsRemaining, setSecondsRemaining] = useState(null)
  const blockBuffer = 3 // Delay countdown by 3s to ensure contract transactions have resolved when countdown finishes

  useEffect(() => {
    const currentSeconds = Math.floor(Date.now() / 1000)
    const secondsRemainingCalc = nextEventTime - currentSeconds
    setSecondsRemaining(secondsRemainingCalc)

    const tick = () => {
      setSecondsRemaining((prevSecondsRemaining) => {
        // Clear current interval at end of countdown
        if (prevSecondsRemaining <= 1) {
          clearInterval(timerInterval)
        }
        return prevSecondsRemaining - 1
      })
    }
    const timerInterval = setInterval(() => tick(), 1000)

    return () => clearInterval(timerInterval)
  }, [setSecondsRemaining, nextEventTime])

  console.log('countdown |', secondsRemaining)
  return secondsRemaining
}

export default useNextEventCountdown
