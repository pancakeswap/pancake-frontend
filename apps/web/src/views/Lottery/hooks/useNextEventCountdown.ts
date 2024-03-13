import { useEffect, useRef, useState } from 'react'
import { useAppDispatch } from 'state'
import { fetchCurrentLottery, setLotteryIsTransitioning } from 'state/lottery'
import { useLottery } from 'state/lottery/hooks'

const useNextEventCountdown = (nextEventTime: number): number | null => {
  const dispatch = useAppDispatch()
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null)
  const timer = useRef<NodeJS.Timer | null>(null)
  const { currentLotteryId } = useLottery()

  useEffect(() => {
    dispatch(setLotteryIsTransitioning({ isTransitioning: false }))
    const currentSeconds = Math.floor(Date.now() / 1000)
    const secondsRemainingCalc = nextEventTime - currentSeconds
    setSecondsRemaining(secondsRemainingCalc)

    timer.current = setInterval(() => {
      setSecondsRemaining((prevSecondsRemaining) => {
        if (prevSecondsRemaining === null) return null
        // Clear current interval at end of countdown and fetch current lottery to get updated state
        if (prevSecondsRemaining <= 1) {
          if (timer.current) clearInterval(timer.current)
          dispatch(setLotteryIsTransitioning({ isTransitioning: true }))
          dispatch(fetchCurrentLottery({ currentLotteryId }))
        }
        return prevSecondsRemaining - 1
      })
    }, 1000)

    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [setSecondsRemaining, nextEventTime, currentLotteryId, timer, dispatch])

  return secondsRemaining
}

export default useNextEventCountdown
