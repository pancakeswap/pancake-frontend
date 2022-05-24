import { useEffect, useRef, useState, useCallback } from 'react'
import isUndefinedOrNull from 'utils/isUndefinedOrNull'

export default function useInterval(
  callback: () => void,
  delay: undefined | null | number,
  leading = true,
  initiateUpdate = true,
) {
  const savedCallback = useRef<() => void>(callback)
  const [isReadyForUpdate, setIsReadyForUpdate] = useState(false)

  const tick = useCallback(() => {
    setIsReadyForUpdate(true)
  }, [])

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (initiateUpdate && isReadyForUpdate) {
      savedCallback.current?.()
      setIsReadyForUpdate(false)
    }
  }, [initiateUpdate, isReadyForUpdate])

  // Set up the interval.
  useEffect(() => {
    if (!isUndefinedOrNull(delay)) {
      if (leading) tick()
      const id = setInterval(tick, delay)
      return () => {
        setIsReadyForUpdate(false)
        clearInterval(id)
      }
    }
    return () => setIsReadyForUpdate(false)
  }, [delay, leading, tick])
}
