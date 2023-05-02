import { Currency } from '@pancakeswap/sdk'
import { FeeAmount, Pool, tickToPrice, TICK_SPACINGS } from '@pancakeswap/v3-sdk'
import { useMemo } from 'react'

import { PoolState, TickProcessed } from './types'
import useAllV3TicksQuery, { TickData } from './useAllV3TicksQuery'
import { usePool } from './usePools'
import computeSurroundingTicks from './utils/computeSurroundingTicks'

const PRICE_FIXED_DIGITS = 8

const getActiveTick = (tickCurrent: number | undefined, feeAmount: FeeAmount | undefined) =>
  tickCurrent !== undefined && feeAmount
    ? Math.floor(tickCurrent / TICK_SPACINGS[feeAmount]) * TICK_SPACINGS[feeAmount]
    : undefined

function useTicksFromSubgraph(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  feeAmount: FeeAmount | undefined,
) {
  const poolAddress =
    currencyA && currencyB && feeAmount
      ? Pool.getAddress(currencyA?.wrapped, currencyB?.wrapped, feeAmount, undefined)
      : undefined

  return useAllV3TicksQuery(poolAddress, 30000)
}

// Fetches all ticks for a given pool
export function useAllV3Ticks(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  feeAmount: FeeAmount | undefined,
): {
  isLoading: boolean
  error: unknown
  ticks: TickData[] | undefined
} {
  const subgraphTickData = useTicksFromSubgraph(currencyA, currencyB, feeAmount)

  return {
    isLoading: subgraphTickData.isLoading,
    error: subgraphTickData.error,
    ticks: subgraphTickData.data,
  }
}

export function usePoolActiveLiquidity(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  feeAmount: FeeAmount | undefined,
): {
  isLoading: boolean
  error: any
  activeTick: number | undefined
  data: TickProcessed[] | undefined
} {
  const pool = usePool(currencyA, currencyB, feeAmount)

  // Find nearest valid tick for pool in case tick is not initialized.
  const activeTick = useMemo(() => getActiveTick(pool[1]?.tickCurrent, feeAmount), [pool, feeAmount])

  const { isLoading, error, ticks } = useAllV3Ticks(currencyA, currencyB, feeAmount)

  return useMemo(() => {
    if (
      !currencyA ||
      !currencyB ||
      activeTick === undefined ||
      pool[0] !== PoolState.EXISTS ||
      !ticks ||
      ticks.length === 0 ||
      isLoading
    ) {
      return {
        isLoading: isLoading || pool[0] === PoolState.LOADING,
        error,
        activeTick,
        data: undefined,
      }
    }

    const token0 = currencyA?.wrapped
    const token1 = currencyB?.wrapped

    // find where the active tick would be to partition the array
    // if the active tick is initialized, the pivot will be an element
    // if not, take the previous tick as pivot
    const pivot = ticks.findIndex(({ tick }) => Number(tick) > activeTick) - 1

    if (pivot < 0) {
      // consider setting a local error
      console.error('TickData pivot not found')
      return {
        isLoading,
        error,
        activeTick,
        data: undefined,
      }
    }

    const activeTickProcessed: TickProcessed = {
      liquidityActive: BigInt(pool[1]?.liquidity ?? 0),
      tick: activeTick,
      liquidityNet: Number(ticks[pivot].tick) === activeTick ? BigInt(ticks[pivot].liquidityNet) : 0n,
      price0: tickToPrice(token0, token1, activeTick).toFixed(PRICE_FIXED_DIGITS),
    }

    const subsequentTicks = computeSurroundingTicks(token0, token1, activeTickProcessed, ticks, pivot, true)

    const previousTicks = computeSurroundingTicks(token0, token1, activeTickProcessed, ticks, pivot, false)

    const ticksProcessed = previousTicks.concat(activeTickProcessed).concat(subsequentTicks)

    return {
      isLoading,
      error,
      activeTick,
      data: ticksProcessed,
    }
  }, [currencyA, currencyB, activeTick, pool, ticks, isLoading, error])
}
