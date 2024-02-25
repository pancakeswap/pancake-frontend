import invariant from 'tiny-invariant'
import { TickList } from '@pancakeswap/v3-sdk'

import {
  BASE_SWAP_COST_STABLE_SWAP,
  BASE_SWAP_COST_V2,
  BASE_SWAP_COST_V3,
  COST_PER_HOP_V3,
  COST_PER_INIT_TICK,
} from '../constants'
import { PoolQuote } from '../v3-router/providers'
import { isStablePool, isV2Pool, isV3Pool } from '../v3-router/utils'

export function estimateGasCost({ pool, poolAfter }: Omit<PoolQuote, 'quote'>): bigint {
  if (isV2Pool(pool)) {
    return BASE_SWAP_COST_V2
  }

  if (isV3Pool(pool) && isV3Pool(poolAfter)) {
    const { ticks, token0, tick } = pool
    invariant(ticks !== undefined, '[Estimate gas]: No valid tick list found')
    const { tick: tickAfter } = poolAfter
    const { chainId } = token0
    const numOfTicksCrossed = TickList.countInitializedTicksCrossed(ticks, tick, tickAfter)
    const tickGasUse = COST_PER_INIT_TICK(chainId) * BigInt(numOfTicksCrossed)
    return BASE_SWAP_COST_V3(chainId) + COST_PER_HOP_V3(chainId) + tickGasUse
  }

  if (isStablePool(pool)) {
    return BASE_SWAP_COST_STABLE_SWAP
  }

  throw new Error('[Estimate gas]: Unknown pool type')
}
