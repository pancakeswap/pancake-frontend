import { useEffect, useState } from 'react'
import { useAppDispatch } from 'state'
import { useLottery } from 'state/hooks'
import { fetchCurrentLottery, setLotteryIsTransitioning } from 'state/lottery'

const useNextEventCountdown = (nextEventTime: number): number => {
  const dispatch = useAppDispatch()
  const [secondsRemaining, setSecondsRemaining] = useState(null)
  const { currentLotteryId } = useLottery()

  useEffect(() => {
    console.log('xxxx COUNTDOWN EFFECT FIRING xxxx')
    dispatch(setLotteryIsTransitioning({ isTransitioning: false }))
    const currentSeconds = Math.floor(Date.now() / 1000)
    const secondsRemainingCalc = nextEventTime - currentSeconds
    setSecondsRemaining(secondsRemainingCalc)

    const tick = () => {
      setSecondsRemaining((prevSecondsRemaining) => {
        // Clear current interval at end of countdown and fetch current lottery to get updated state
        if (prevSecondsRemaining <= 1) {
          console.log('yyyy COUNTDOWN FINISHED yyyy')
          clearInterval(timerInterval)
          dispatch(setLotteryIsTransitioning({ isTransitioning: true }))
          dispatch(fetchCurrentLottery({ currentLotteryId }))
        }
        return prevSecondsRemaining - 1
      })
    }
    const timerInterval = setInterval(() => tick(), 1000)

    return () => clearInterval(timerInterval)
  }, [setSecondsRemaining, nextEventTime, currentLotteryId, dispatch])

  console.log('countdown |', secondsRemaining)
  return secondsRemaining
}

export default useNextEventCountdown
