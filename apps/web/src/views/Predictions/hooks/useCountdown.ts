import { accurateTimer } from 'utils/accurateTimer'
import useServerTimestamp from 'hooks/useServerTimestamp'
import { useCallback, useEffect, useState, useRef } from 'react'
import { useIsWindowVisible } from '@pancakeswap/hooks'

const getSecondsRemainingToNow = (now: number, timestamp: number) => {
  return Number.isFinite(timestamp) && timestamp > now ? timestamp - now : 0
}

/**
 * Consider this moving up to the global level
 */
const useCountdown = (timestamp: number) => {
  const timerCancelRef = useRef(null)
  const getNow = useServerTimestamp()
  const [secondsRemaining, setSecondsRemaining] = useState(null)
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
    if (isWindowVisible && getNow) {
      setSecondsRemaining(getSecondsRemainingToNow(getNow(), timestamp))
      unpause()
    } else {
      pause()
    }
  }, [getNow, pause, unpause, timestamp, setSecondsRemaining, isWindowVisible])

  return { secondsRemaining, pause, unpause }
}

export default useCountdown
