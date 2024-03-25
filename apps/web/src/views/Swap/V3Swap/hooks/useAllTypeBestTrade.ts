import { SmartRouterTrade, V4Router } from '@pancakeswap/smart-router'
import { TradeType } from '@pancakeswap/swap-sdk-core'
import { useThrottleFn } from 'hooks/useThrottleFn'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useDerivedBestTradeWithMM } from 'views/Swap/MMLinkPools/hooks/useDerivedSwapInfoWithMM'
import { useSwapBestTrade } from './useSwapBestTrade'

type Trade = SmartRouterTrade<TradeType> | V4Router.V4TradeWithoutGraph<TradeType>

export const useAllTypeBestTrade = () => {
  const [isQuotingPaused, setIsQuotingPaused] = useState(false)
  const { isLoading, trade, refresh, syncing, isStale, error } = useSwapBestTrade()
  const mm = useDerivedBestTradeWithMM<Trade>(trade)
  const lockedAMMTrade = useRef<Trade | undefined>()
  const lockedMMTrade = useRef<ReturnType<typeof useDerivedBestTradeWithMM<Trade>>>()

  const ammCurrentTrade = useMemo(() => {
    if (!lockedAMMTrade.current) {
      lockedAMMTrade.current = trade
    }
    lockedAMMTrade.current = isQuotingPaused ? lockedAMMTrade.current : trade
    return lockedAMMTrade.current
  }, [isQuotingPaused, trade])
  const mmCurrentTrade = useMemo(() => {
    if (!lockedMMTrade.current) {
      lockedMMTrade.current = mm
    }
    lockedMMTrade.current = isQuotingPaused ? lockedMMTrade.current : mm
    return lockedMMTrade.current
  }, [isQuotingPaused, mm])

  const pauseQuoting = useCallback(() => {
    setIsQuotingPaused(true)
  }, [])

  const resumeQuoting = useCallback(() => {
    setIsQuotingPaused(false)
  }, [])

  const refreshTrade = useThrottleFn(refresh, 3000)

  return {
    isMMBetter: mmCurrentTrade?.isMMBetter,
    bestTrade: mmCurrentTrade?.isMMBetter ? mmCurrentTrade?.mmTradeInfo?.trade : ammCurrentTrade,
    ammTrade: ammCurrentTrade,
    mmTrade: mmCurrentTrade,
    tradeLoaded: !isLoading,
    tradeError: error,
    refreshDisabled: isLoading || syncing || !isStale,
    refreshTrade,
    pauseQuoting,
    resumeQuoting,
  }
}
