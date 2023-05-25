import { TickMath } from './tickMath'
import { SqrtPriceMath } from './sqrtPriceMath'
import { ZERO } from '../internalConstants'

function getToken0Amount(
  tickCurrent: number,
  tickLower: number,
  tickUpper: number,
  sqrtRatioX96: bigint,
  liquidity: bigint
): bigint {
  if (tickCurrent < tickLower) {
    return SqrtPriceMath.getAmount0Delta(
      TickMath.getSqrtRatioAtTick(tickLower),
      TickMath.getSqrtRatioAtTick(tickUpper),
      liquidity,
      false
    )
  }
  if (tickCurrent < tickUpper) {
    return SqrtPriceMath.getAmount0Delta(sqrtRatioX96, TickMath.getSqrtRatioAtTick(tickUpper), liquidity, false)
  }
  return ZERO
}

function getToken1Amount(
  tickCurrent: number,
  tickLower: number,
  tickUpper: number,
  sqrtRatioX96: bigint,
  liquidity: bigint
): bigint {
  if (tickCurrent < tickLower) {
    return ZERO
  }
  if (tickCurrent < tickUpper) {
    return SqrtPriceMath.getAmount1Delta(TickMath.getSqrtRatioAtTick(tickLower), sqrtRatioX96, liquidity, false)
  }
  return SqrtPriceMath.getAmount1Delta(
    TickMath.getSqrtRatioAtTick(tickLower),
    TickMath.getSqrtRatioAtTick(tickUpper),
    liquidity,
    false
  )
}

export const PositionMath = {
  getToken0Amount,
  getToken1Amount,
}
