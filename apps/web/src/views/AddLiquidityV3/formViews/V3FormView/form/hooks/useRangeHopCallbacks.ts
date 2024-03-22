import { Currency } from '@pancakeswap/sdk'
import { FeeAmount, Pool, TICK_SPACINGS, nearestUsableTick, tickToPrice } from '@pancakeswap/v3-sdk'
import { useCallback, useMemo } from 'react'
import { setFullRange } from 'views/AddLiquidityV3/formViews/V3FormView/form/actions'
import { useV3FormDispatch } from '../reducer'

export function useRangeHopCallbacks(
  baseCurrency: Currency | undefined,
  quoteCurrency: Currency | undefined,
  feeAmount: FeeAmount | undefined,
  tickLower: number | undefined,
  tickUpper: number | undefined,
  pool?: Pool | undefined | null,
) {
  const dispatch = useV3FormDispatch()

  const baseToken = useMemo(() => baseCurrency?.wrapped, [baseCurrency])
  const quoteToken = useMemo(() => quoteCurrency?.wrapped, [quoteCurrency])

  const getDecrementLower = useCallback(() => {
    if (baseToken && quoteToken && typeof tickLower === 'number' && feeAmount) {
      return tickToPrice(
        baseToken,
        quoteToken,
        nearestUsableTick(tickLower - TICK_SPACINGS[feeAmount], TICK_SPACINGS[feeAmount]),
      )
    }
    // use pool current tick as starting tick if we have pool but no tick input
    if (!(typeof tickLower === 'number') && baseToken && quoteToken && feeAmount && pool) {
      return tickToPrice(
        baseToken,
        quoteToken,
        nearestUsableTick(pool.tickCurrent - TICK_SPACINGS[feeAmount], TICK_SPACINGS[feeAmount]),
      )
    }
    return undefined
  }, [baseToken, quoteToken, tickLower, feeAmount, pool])

  const getIncrementLower = useCallback(() => {
    if (baseToken && quoteToken && typeof tickLower === 'number' && feeAmount) {
      return tickToPrice(
        baseToken,
        quoteToken,
        nearestUsableTick(tickLower + TICK_SPACINGS[feeAmount], TICK_SPACINGS[feeAmount]),
      )
    }
    // use pool current tick as starting tick if we have pool but no tick input
    if (!(typeof tickLower === 'number') && baseToken && quoteToken && feeAmount && pool) {
      return tickToPrice(
        baseToken,
        quoteToken,
        nearestUsableTick(pool.tickCurrent + TICK_SPACINGS[feeAmount], TICK_SPACINGS[feeAmount]),
      )
    }
    return undefined
  }, [baseToken, quoteToken, tickLower, feeAmount, pool])

  const getDecrementUpper = useCallback(() => {
    if (baseToken && quoteToken && typeof tickUpper === 'number' && feeAmount) {
      return tickToPrice(
        baseToken,
        quoteToken,
        nearestUsableTick(tickUpper - TICK_SPACINGS[feeAmount], TICK_SPACINGS[feeAmount]),
      )
    }
    // use pool current tick as starting tick if we have pool but no tick input
    if (!(typeof tickUpper === 'number') && baseToken && quoteToken && feeAmount && pool) {
      return tickToPrice(
        baseToken,
        quoteToken,
        nearestUsableTick(pool.tickCurrent - TICK_SPACINGS[feeAmount], TICK_SPACINGS[feeAmount]),
      )
    }
    return undefined
  }, [baseToken, quoteToken, tickUpper, feeAmount, pool])

  const getIncrementUpper = useCallback(() => {
    if (baseToken && quoteToken && typeof tickUpper === 'number' && feeAmount) {
      return tickToPrice(
        baseToken,
        quoteToken,
        nearestUsableTick(tickUpper + TICK_SPACINGS[feeAmount], TICK_SPACINGS[feeAmount]),
      )
    }
    // use pool current tick as starting tick if we have pool but no tick input
    if (!(typeof tickUpper === 'number') && baseToken && quoteToken && feeAmount && pool) {
      return tickToPrice(
        baseToken,
        quoteToken,
        nearestUsableTick(pool.tickCurrent + TICK_SPACINGS[feeAmount], TICK_SPACINGS[feeAmount]),
      )
    }
    return undefined
  }, [baseToken, quoteToken, tickUpper, feeAmount, pool])

  const getSetFullRange = useCallback(() => {
    dispatch(setFullRange())
  }, [dispatch])

  return { getDecrementLower, getIncrementLower, getDecrementUpper, getIncrementUpper, getSetFullRange }
}
