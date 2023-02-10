import { useEffect, useState, useMemo } from 'react'
import { SAFE_MM_QUOTE_EXPIRY_SEC } from '../constants'

export const useMMQuoteCountDown = (quoteExpiry: number | null, refreshRFQ?: () => void) => {
  const countDownDate = quoteExpiry ? quoteExpiry * 1000 : Date.now()

  const [countDown, setCountDown] = useState(() => countDownDate - Date.now())
  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime())
    }, 1000)

    return () => clearInterval(interval)
  }, [countDownDate])

  const remainingSec = useMemo(() => {
    if (!countDown) return null
    return Math.floor((countDown / 1000) % 60)
  }, [countDown])
  if (remainingSec && remainingSec > 0 && remainingSec < SAFE_MM_QUOTE_EXPIRY_SEC && refreshRFQ) {
    refreshRFQ?.()
  }
  return { remainingSec }
}
