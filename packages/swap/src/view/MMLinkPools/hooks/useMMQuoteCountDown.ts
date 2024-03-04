import { useEffect, useState, useRef } from 'react'
import { SAFE_MM_QUOTE_EXPIRY_SEC } from '../constants'

export const useMMQuoteCountDown = (quoteExpiry: number | null, refreshRFQ?: () => void) => {
  const reFetched = useRef<boolean>(false)

  const [remainingSec, setRemainingSec] = useState(null)

  useEffect(() => {
    reFetched.current = false
    let interval
    if (quoteExpiry) {
      interval = setInterval(() => {
        const newRemainingSec = Math.floor(((quoteExpiry * 1000 - Date.now()) / 1000) % 60)
        setRemainingSec(newRemainingSec > 0 ? newRemainingSec : null)
        if (
          !reFetched.current &&
          newRemainingSec &&
          newRemainingSec > 0 &&
          newRemainingSec === SAFE_MM_QUOTE_EXPIRY_SEC - 1 &&
          refreshRFQ
        ) {
          refreshRFQ?.()
          reFetched.current = true
        }
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
        setRemainingSec(null)
      }
    }
  }, [quoteExpiry, refreshRFQ])

  return remainingSec
}
