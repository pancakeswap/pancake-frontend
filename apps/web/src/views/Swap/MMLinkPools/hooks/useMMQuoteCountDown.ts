import { Currency, TradeType } from '@pancakeswap/swap-sdk-core'
import { useEffect, useState, useMemo, useRef } from 'react'
import { SAFE_MM_QUOTE_EXPIRY_SEC } from '../constants'
import { TradeWithMM } from '../types'

export const useMMQuoteCountDown = (
  trade: TradeWithMM<Currency, Currency, TradeType> | null,
  quoteExpiry: number | null,
  refreshRFQ?: () => void,
) => {
  const reFetched = useRef<boolean>(false)
  const countDownDate = useMemo(() => (quoteExpiry ? quoteExpiry * 1000 : Date.now()), [quoteExpiry])

  const [countDown, setCountDown] = useState(() => countDownDate - Date.now())
  useEffect(() => {
    let interval
    if (trade) {
      interval = setInterval(() => {
        setCountDown(countDownDate - Date.now())
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [countDownDate, trade])
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
