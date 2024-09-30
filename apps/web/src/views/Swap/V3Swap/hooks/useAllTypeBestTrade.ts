import { OrderType } from '@pancakeswap/price-api-sdk'
import { SmartRouterTrade, V4Router } from '@pancakeswap/smart-router'
import { Currency, TradeType } from '@pancakeswap/swap-sdk-core'
import { useCallback, useMemo, useRef, useState } from 'react'

import { useBetterQuote } from 'hooks/useBestAMMTrade'
import { useThrottleFn } from 'hooks/useThrottleFn'
import { InterfaceOrder } from 'views/Swap/utils'
import { usePCSX } from 'hooks/usePCSX'

import { useSwapBestOrder, useSwapBestTrade } from './useSwapBestTrade'

type Trade = SmartRouterTrade<TradeType> | V4Router.V4TradeWithoutGraph<TradeType>

export const useAllTypeBestTrade = () => {
  const [xEnabled] = usePCSX()
  const [isQuotingPaused, setIsQuotingPaused] = useState(false)
  const bestOrder = useSwapBestOrder()
  const { isLoading, trade, refresh, syncing, isStale, error } = useSwapBestTrade({ maxHops: 3 })
  const lockedAMMTrade = useRef<Trade | undefined>()
  const lockedOrder = useRef<
    | (InterfaceOrder<Currency, Currency> & {
        isLoading: typeof isLoading
        error: typeof error
      })
    | undefined
  >()

  const currentOrder = useMemo(() => {
    const best = bestOrder.order
      ? {
          ...bestOrder.order,
          isLoading: bestOrder.isLoading,
          error: bestOrder.error ?? undefined,
        }
      : undefined
    if (!lockedOrder.current) {
      lockedOrder.current = best
    }
    lockedOrder.current = isQuotingPaused ? lockedOrder.current : best
    return lockedOrder.current
  }, [isQuotingPaused, bestOrder.order, bestOrder.isLoading, bestOrder.error])

  const ammCurrentTrade = useMemo(() => {
    if (!lockedAMMTrade.current) {
      lockedAMMTrade.current = trade
    }
    lockedAMMTrade.current = isQuotingPaused ? lockedAMMTrade.current : trade
    return lockedAMMTrade.current
  }, [isQuotingPaused, trade])

  const pauseQuoting = useCallback(() => {
    setIsQuotingPaused(true)
  }, [])

  const resumeQuoting = useCallback(() => {
    setIsQuotingPaused(false)
  }, [])

  const refreshTrade = useThrottleFn(refresh, 3000)
  const refreshOrder = useThrottleFn(bestOrder.refresh, 3000)

  const classicAmmOrder = useMemo(() => {
    return ammCurrentTrade
      ? {
          trade: ammCurrentTrade,
          type: OrderType.PCS_CLASSIC,
          isLoading,
          error: error ?? undefined,
        }
      : undefined
  }, [ammCurrentTrade, isLoading, error])

  const hasAvailableDutchOrder =
    bestOrder.enabled && bestOrder.order?.type === OrderType.DUTCH_LIMIT && bestOrder.isValidQuote
  const betterQuote = useBetterQuote(classicAmmOrder, hasAvailableDutchOrder ? currentOrder : undefined)
  const finalOrder = xEnabled ? betterQuote : classicAmmOrder

  return {
    ammOrder: classicAmmOrder,
    xOrder: currentOrder,
    // TODO: for log purpose in this stage
    betterOrder: betterQuote,
    bestOrder: finalOrder as InterfaceOrder | undefined,
    tradeLoaded: !finalOrder?.isLoading,
    tradeError: finalOrder?.error,
    refreshDisabled:
      finalOrder?.type === OrderType.DUTCH_LIMIT
        ? bestOrder.isLoading || !bestOrder.isStale
        : isLoading || syncing || !isStale,
    refreshOrder: finalOrder?.type === OrderType.DUTCH_LIMIT ? refreshOrder : refreshTrade,
    refreshTrade,
    pauseQuoting,
    resumeQuoting,
  }
}
