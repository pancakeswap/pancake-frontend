import { Currency, CurrencyAmount, JSBI, MaxUint256, Percent, Fraction, ZERO } from '@pancakeswap/sdk'
import invariant from 'tiny-invariant'

import { maxLiquidityForAmounts } from './maxLiquidityForAmounts'
import { TickMath } from './tickMath'
import { PositionMath } from './positionMath'
import { TICK_SPACINGS, FeeAmount } from '../constants'
import { ONE_HUNDRED_PERCENT, MAX_FEE } from '../internalConstants'
import { Tick } from '../entities'
import { TickList } from './tickList'

export const FeeCalculator = {
  getEstimatedLPFee,
  getLiquidityFromTick,
  getLiquidityFromSqrtRatioX96,
  getAverageLiquidity,
  getLiquidityBySingleAmount,
  getDependentAmount,
}

interface EstimateFeeOptions {
  // Amount of token user input
  amount: CurrencyAmount<Currency>
  // Currency of the other token in the pool
  currency: Currency
  tickLower: number
  tickUpper: number
  // Average 24h historical trading volume in USD
  volume24H: number

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

export function getEstimatedLPFee(options: EstimateFeeOptions) {
  try {
    return tryGetEstimatedLPFee(options)
  } catch (e) {
    console.error(e)
    return new Fraction(ZERO)
  }
}

function tryGetEstimatedLPFee({
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

  const liquidity = FeeCalculator.getLiquidityBySingleAmount({ amount, currency, tickUpper, tickLower, sqrtRatioX96 })
  const liquidityInRange = FeeCalculator.getLiquidityFromSqrtRatioX96(ticks, sqrtRatioX96)

  return insidePercentage
    .multiply(JSBI.multiply(JSBI.multiply(JSBI.BigInt(Math.floor(volume24H)), JSBI.BigInt(fee)), liquidity))
    .divide(JSBI.multiply(MAX_FEE, JSBI.add(liquidity, liquidityInRange))).asFraction
}

interface GetAmountOptions {
  // Amount of token user input
  amount: CurrencyAmount<Currency>
  // Currency of the dependent token in the pool
  currency: Currency
  tickLower: number
  tickUpper: number

  // The reason of using price sqrt X96 instead of tick current is that
  // tick current may have rounding error since it's a floor rounding
  sqrtRatioX96: JSBI
}

export function getDependentAmount(options: GetAmountOptions) {
  const { currency, amount, sqrtRatioX96, tickLower, tickUpper } = options
  const currentTick = TickMath.getTickAtSqrtRatio(sqrtRatioX96)
  const liquidity = FeeCalculator.getLiquidityBySingleAmount(options)
  const isToken0 = currency.wrapped.sortsBefore(amount.currency.wrapped)
  const getTokenAmount = isToken0 ? PositionMath.getToken0Amount : PositionMath.getToken1Amount
  return CurrencyAmount.fromRawAmount(
    currency,
    getTokenAmount(currentTick, tickLower, tickUpper, sqrtRatioX96, liquidity)
  )
}

export function getLiquidityBySingleAmount({
  amount,
  currency,
  tickUpper,
  tickLower,
  sqrtRatioX96,
}: GetAmountOptions): JSBI {
  const isToken0 = amount.currency.wrapped.sortsBefore(currency.wrapped)
  const [inputAmount0, inputAmount1] = isToken0 ? [amount.quotient, MaxUint256] : [MaxUint256, amount.quotient]
  const sqrtRatioAX96 = TickMath.getSqrtRatioAtTick(tickLower)
  const sqrtRatioBX96 = TickMath.getSqrtRatioAtTick(tickUpper)
  return maxLiquidityForAmounts(sqrtRatioX96, sqrtRatioAX96, sqrtRatioBX96, inputAmount0, inputAmount1, true)
}

export function getAverageLiquidity(ticks: Tick[], tickSpacing: number, tickLower: number, tickUpper: number): JSBI {
  invariant(tickLower <= tickUpper, 'INVALID_TICK_RANGE')
  TickList.validateList(ticks, tickSpacing)

  if (tickLower === tickUpper) {
    return FeeCalculator.getLiquidityFromTick(ticks, tickLower)
  }

  const lowerOutOfBound = tickLower < ticks[0].index
  let lastTick = lowerOutOfBound
    ? new Tick({ index: TickMath.MIN_TICK, liquidityNet: ZERO, liquidityGross: ZERO })
    : TickList.nextInitializedTick(ticks, tickLower, true)
  let currentTick = TickList.nextInitializedTick(ticks, tickLower, false)
  let currentL = lowerOutOfBound ? ZERO : FeeCalculator.getLiquidityFromTick(ticks, currentTick.index)
  let weightedL = ZERO
  const getWeightedLFromLastTickTo = (toTick: number) =>
    JSBI.multiply(currentL, JSBI.BigInt(toTick - Math.max(lastTick.index, tickLower)))
  while (currentTick.index < tickUpper) {
    weightedL = JSBI.add(weightedL, getWeightedLFromLastTickTo(currentTick.index))
    currentL = JSBI.add(currentL, currentTick.liquidityNet)
    lastTick = currentTick

    // Tick upper is out of initialized tick range
    if (currentTick.index === ticks[ticks.length - 1].index) {
      break
    }

    currentTick = TickList.nextInitializedTick(ticks, currentTick.index, false)
  }
  weightedL = JSBI.add(weightedL, getWeightedLFromLastTickTo(tickUpper))

  return JSBI.divide(weightedL, JSBI.BigInt(tickUpper - tickLower))
}

export function getLiquidityFromSqrtRatioX96(ticks: Tick[], sqrtRatioX96: JSBI): JSBI {
  const tick = TickMath.getTickAtSqrtRatio(sqrtRatioX96)
  return FeeCalculator.getLiquidityFromTick(ticks, tick)
}

export function getLiquidityFromTick(ticks: Tick[], tick: number): JSBI {
  // calculate a cumulative of liquidityNet from all ticks that poolTicks[i] <= tick
  let liquidity = ZERO

  if (tick < ticks[0].index || tick > ticks[ticks.length - 1].index) {
    return liquidity
  }

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
