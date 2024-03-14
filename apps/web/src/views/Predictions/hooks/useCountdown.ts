import { useIsWindowVisible } from '@pancakeswap/hooks'
import { useCallback, useEffect, useRef, useState } from 'react'
import { accurateTimer } from 'utils/accurateTimer'
import { getNowInSeconds } from 'utils/getNowInSeconds'

const getSecondsRemainingToNow = (timestamp: number) => {
  const now = getNowInSeconds()
  return Number.isFinite(timestamp) && timestamp > now ? timestamp - now : 0
}

/**
 * Consider this moving up to the global level
 */
const useCountdown = (timestamp: number) => {
  const timerCancelRef = useRef<(() => void) | null>(null)
  const [secondsRemaining, setSecondsRemaining] = useState(() => getSecondsRemainingToNow(timestamp))
  const [isPaused, setIsPaused] = useState(false)
  const isWindowVisible = useIsWindowVisible()

  const pause = useCallback(() => setIsPaused(true), [setIsPaused])
  const unpause = useCallback(() => setIsPaused(false), [setIsPaused])

  useEffect(() => {
    let cancel
    if (!isPaused) {
      const { cancel: timerCancel } = accurateTimer(() => {
        setSecondsRemaining((prevSecondsRemaining) => {
          if (prevSecondsRemaining) {
            return prevSecondsRemaining - 1
          }
          timerCancelRef.current?.()
          return prevSecondsRemaining
        })
      })
      cancel = timerCancel
      timerCancelRef.current = timerCancel
    }

    return () => {
      cancel?.()
    }
  }, [isPaused, timestamp, setSecondsRemaining])

  // Pause the timer if the tab becomes inactive to avoid it becoming out of sync
  useEffect(() => {
    if (isWindowVisible) {
      setSecondsRemaining(getSecondsRemainingToNow(timestamp))
      unpause()
    } else {
      pause()
    }
  }, [pause, unpause, timestamp, setSecondsRemaining, isWindowVisible])

  return { secondsRemaining, pause, unpause }
}

export default useCountdown
