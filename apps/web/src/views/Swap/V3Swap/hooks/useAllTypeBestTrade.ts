import { ClassicOrder, OrderType } from '@pancakeswap/price-api-sdk'
import { SmartRouterTrade, V4Router } from '@pancakeswap/smart-router'
import { Currency, TradeType } from '@pancakeswap/swap-sdk-core'
import { useThrottleFn } from 'hooks/useThrottleFn'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useDerivedBestTradeWithMM } from 'views/Swap/MMLinkPools/hooks/useDerivedSwapInfoWithMM'
import { InterfaceOrder, MMOrder } from 'views/Swap/utils'
import { useSwapBestOrder, useSwapBestTrade } from './useSwapBestTrade'

type Trade = SmartRouterTrade<TradeType> | V4Router.V4TradeWithoutGraph<TradeType>

export const useAllTypeBestTrade = () => {
  const [isQuotingPaused, setIsQuotingPaused] = useState(false)
  const bestOrder = useSwapBestOrder()
  const { isLoading, trade, refresh, syncing, isStale, error } = useSwapBestTrade()
  const mm = useDerivedBestTradeWithMM<Trade>(trade)
  const lockedAMMTrade = useRef<Trade | undefined>()
  const lockedMMTrade = useRef<ReturnType<typeof useDerivedBestTradeWithMM<Trade>>>()
  const lockedOrder = useRef<InterfaceOrder<Currency, Currency> | undefined>()

  const currentOrder = useMemo(() => {
    if (!lockedOrder.current) {
      lockedOrder.current = bestOrder.order
    }
    lockedOrder.current = isQuotingPaused ? lockedOrder.current : bestOrder.order
    return lockedOrder.current
  }, [isQuotingPaused, bestOrder.order])

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
  const refreshOrder = useThrottleFn(bestOrder.refresh, 3000)

  const classicAmmOrder = useMemo(() => {
    return {
      trade: ammCurrentTrade,
      type: OrderType.PCS_CLASSIC,
    } as ClassicOrder
  }, [ammCurrentTrade])

  const classicMMOrder: MMOrder | undefined = useMemo(() => {
    if (!mmCurrentTrade?.mmTradeInfo) {
      return undefined
    }

    return {
      trade: mmCurrentTrade?.mmTradeInfo?.trade,
      type: 'MM',
      ...mmCurrentTrade,
    }
  }, [mmCurrentTrade])

  return {
    bestOrder: (bestOrder.enabled
      ? currentOrder
      : mmCurrentTrade?.isMMBetter
      ? classicMMOrder
      : classicAmmOrder) as InterfaceOrder,
    isMMBetter: !bestOrder.order && mmCurrentTrade?.isMMBetter,
    mmTrade: mmCurrentTrade,
    tradeLoaded: bestOrder.enabled ? !bestOrder.isLoading : !isLoading,
    tradeError: bestOrder.enabled ? bestOrder.error : error,
    refreshDisabled: bestOrder.enabled ? bestOrder.isLoading || !bestOrder.isStale : isLoading || syncing || !isStale,
    refreshOrder: bestOrder.enabled ? refreshOrder : refreshTrade,
    refreshTrade,
    pauseQuoting,
    resumeQuoting,
  }
}
