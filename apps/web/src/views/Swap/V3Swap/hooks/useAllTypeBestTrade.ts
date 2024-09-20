import { OrderType } from '@pancakeswap/price-api-sdk'
import { SmartRouterTrade, V4Router } from '@pancakeswap/smart-router'
import { Currency, TradeType } from '@pancakeswap/swap-sdk-core'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { getLogger } from 'utils/datadog'
import { useBetterQuote } from 'hooks/useBestAMMTrade'
import { useThrottleFn } from 'hooks/useThrottleFn'
import { InterfaceOrder } from 'views/Swap/utils'
import { usePCSX } from 'hooks/usePCSX'

import { useSwapBestOrder, useSwapBestTrade } from './useSwapBestTrade'

type Trade = SmartRouterTrade<TradeType> | V4Router.V4TradeWithoutGraph<TradeType>

const logger = getLogger('best-quote', { forwardErrorsToLogs: false })

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
    return {
      trade: ammCurrentTrade,
      type: OrderType.PCS_CLASSIC,
      isLoading,
      error: error ?? undefined,
    }
  }, [ammCurrentTrade, isLoading, error])

  // TODO: switch to use classic amm by default before launch
  const hasAvailableDutchOrder = bestOrder.order?.type === OrderType.DUTCH_LIMIT
  const betterQuote = useBetterQuote(
    hasAvailableDutchOrder ? undefined : classicAmmOrder,
    hasAvailableDutchOrder ? currentOrder : undefined,
  )
  const finalOrder = xEnabled ? betterQuote : classicAmmOrder

  useEffect(() => {
    if (betterQuote?.trade && !betterQuote.isLoading) {
      console.log('[DEBUG ROUTE]: better quote update', betterQuote)
      try {
        logger.info('Best quote', {
          quoteType: betterQuote.type,
        })
      } catch (e) {
        console.error(e)
      }
    }
  }, [betterQuote])

  return {
    bestOrder: finalOrder as InterfaceOrder,
    isMMBetter: false,
    mmTrade: undefined,
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
