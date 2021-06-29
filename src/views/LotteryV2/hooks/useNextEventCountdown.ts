import { useEffect, useState } from 'react'
import { useAppDispatch } from 'state'
import { setLotteryIsTransitioning } from 'state/lottery'

const useNextEventCountdown = (nextEventTime: number): number => {
  const dispatch = useAppDispatch()
  const [secondsRemaining, setSecondsRemaining] = useState(null)

  useEffect(() => {
    console.log('xxxx COUNTDOWN EFFECT FIRING xxxx')
    dispatch(setLotteryIsTransitioning({ isTransitioning: false }))
    const currentSeconds = Math.floor(Date.now() / 1000)
    const secondsRemainingCalc = nextEventTime - currentSeconds
    setSecondsRemaining(secondsRemainingCalc)

    const tick = () => {
      setSecondsRemaining((prevSecondsRemaining) => {
        // Clear current interval at end of countdown
        if (prevSecondsRemaining <= 1) {
          console.log('yyyy COUNTDOWN FINISHED yyyy')
          clearInterval(timerInterval)
          dispatch(setLotteryIsTransitioning({ isTransitioning: true }))
        }
        return prevSecondsRemaining - 1
      })
    }
    const timerInterval = setInterval(() => tick(), 1000)

    return () => clearInterval(timerInterval)
  }, [setSecondsRemaining, nextEventTime, dispatch])

  console.log('countdown |', secondsRemaining)
  return secondsRemaining
}

export default useNextEventCountdown
