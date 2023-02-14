import { useEffect, useState, useMemo, useRef } from 'react'
import { SAFE_MM_QUOTE_EXPIRY_SEC } from '../constants'

export const useMMQuoteCountDown = (quoteExpiry: number | null, refreshRFQ?: () => void) => {
  const reFetched = useRef<boolean>(false)
  const countDownDate = useMemo(() => (quoteExpiry ? quoteExpiry * 1000 : Date.now()), [quoteExpiry])

  const [countDown, setCountDown] = useState(() => countDownDate - Date.now())
  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime())
    }, 1000)

    return () => clearInterval(interval)
  }, [countDownDate])
  useEffect(() => {
    reFetched.current = false
  }, [quoteExpiry])

  const remainingSec = useMemo(() => {
    if (!countDown) return null
    return Math.floor((countDown / 1000) % 60)
  }, [countDown])
  if (
    !reFetched.current &&
    remainingSec &&
    remainingSec > 0 &&
    remainingSec === SAFE_MM_QUOTE_EXPIRY_SEC - 1 &&
    refreshRFQ
  ) {
    refreshRFQ?.()
    reFetched.current = true
  }
  return { remainingSec }
}
