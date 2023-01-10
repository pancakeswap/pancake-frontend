import { Currency, CurrencyAmount, JSBI, MaxUint256, Percent, Fraction, ZERO } from '@pancakeswap/sdk'
import invariant from 'tiny-invariant'

import { maxLiquidityForAmounts } from './maxLiquidityForAmounts'
import { TickMath } from './tickMath'
import { TICK_SPACINGS, FeeAmount } from '../constants'
import { ONE_HUNDRED_PERCENT, MAX_FEE } from '../internalConstants'
import { Tick } from '../entities'
import { TickList } from './tickList'

interface EstimateFeeOptions {
  // Amount of token user input
  amount: CurrencyAmount<Currency>
  // Currency of the other token in the pool
  currency: Currency
  tickLower: number
  tickUpper: number
  // Average 24h historical trading volume in USD
  volume24H: number | JSBI

  // The reason of using price sqrt X96 instead of tick current is that
  // tick current may have rounding error since it's a floor rounding
  sqrtRatioX96: JSBI
  // All ticks inside the pool
  ticks: Tick[]
  // Fee tier of the pool, in hundreds of a bip, i.e. 1e-6
  fee: number
  // Tick spacing of the pool, default derived by the fee
  tickSpacing?: number

  // Proportion of time in future 24 hours when price staying inside given tick range
  insidePercentage?: Percent
}

export function getEstimatedLPFees({
  amount,
  currency,
  volume24H,
  sqrtRatioX96,
  tickLower,
  tickUpper,
  ticks,
  fee,
  tickSpacing = TICK_SPACINGS[fee as FeeAmount],
  insidePercentage = ONE_HUNDRED_PERCENT,
}: EstimateFeeOptions): Fraction {
  invariant(!Number.isNaN(fee) && fee >= 0, 'INVALID_FEE')
  TickList.validateList(ticks, tickSpacing)

  const isToken0 = amount.currency.wrapped.sortsBefore(currency.wrapped)
  const [inputAmount0, inputAmount1] = isToken0 ? [amount.quotient, MaxUint256] : [MaxUint256, amount.quotient]
  const sqrtRatioAX96 = TickMath.getSqrtRatioAtTick(tickLower)
  const sqrtRatioBX96 = TickMath.getSqrtRatioAtTick(tickUpper)
  const liquidity = maxLiquidityForAmounts(sqrtRatioX96, sqrtRatioAX96, sqrtRatioBX96, inputAmount0, inputAmount1, true)

  const liquidityInRange = getAverageLiquidity(ticks, tickSpacing, tickLower, tickUpper)

  return insidePercentage.multiply(
    JSBI.divide(
      JSBI.multiply(JSBI.multiply(JSBI.BigInt(volume24H), JSBI.BigInt(fee)), liquidity),
      JSBI.multiply(MAX_FEE, JSBI.add(liquidity, liquidityInRange))
    )
  )
}

function getAverageLiquidity(ticks: Tick[], tickSpacing: number, tickLower: number, tickUpper: number): JSBI {
  invariant(tickLower <= tickUpper, 'INVALID_TICK_RANGE')
  TickList.validateList(ticks, tickSpacing)

  if (tickLower === tickUpper) {
    return getLiquidityFromTick(ticks, tickLower)
  }

  let lastTick = TickList.nextInitializedTick(ticks, tickLower, true)
  let currentTick = TickList.nextInitializedTick(ticks, tickLower, false)
  let currentL = getLiquidityFromTick(ticks, tickLower)
  let weightedL = ZERO
  while (currentTick.index < tickUpper) {
    weightedL = JSBI.multiply(currentL, JSBI.BigInt(currentTick.index - Math.max(lastTick.index, tickLower)))
    currentL = JSBI.add(currentL, currentTick.liquidityNet)
    lastTick = currentTick
    currentTick = TickList.nextInitializedTick(ticks, currentTick.index, false)
  }
  weightedL = JSBI.multiply(currentL, JSBI.BigInt(tickUpper - Math.max(lastTick.index, tickLower)))

  return JSBI.divide(weightedL, JSBI.BigInt(tickUpper - tickLower))
}

function getLiquidityFromTick(ticks: Tick[], tick: number): JSBI {
  // calculate a cumulative of liquidityNet from all ticks that poolTicks[i] <= tick
  let liquidity = ZERO
  for (let i = 0; i < ticks.length - 1; ++i) {
    liquidity = JSBI.add(liquidity, ticks[i].liquidityNet)

    const lowerTick = ticks[i].index
    const upperTick = ticks[i + 1]?.index

    if (lowerTick <= tick && tick <= upperTick) {
      break
    }
  }

  return liquidity
}
