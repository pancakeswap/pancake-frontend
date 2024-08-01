import throttle from 'lodash/throttle'
import { useEffect, useMemo, useRef } from 'react'

type F = (...args: any[]) => any

export const useThrottleFn = <T extends F>(fn: T, delay: number) => {
  const fnRef = useRef(fn)

  useEffect(() => {
    fnRef.current = fn
  }, [fn])

  const throttled = useMemo(
    () =>
      throttle((...args: Parameters<T>): ReturnType<T> => {
        return fnRef.current(...args)
      }, delay),
    [delay],
  )

  useEffect(() => {
    return () => {
      throttled.cancel()
    }
  }, [throttled])

  return throttled
}
