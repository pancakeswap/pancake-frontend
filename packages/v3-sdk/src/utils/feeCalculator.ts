import { Currency, CurrencyAmount, MaxUint256, Percent, Fraction, ZERO } from '@pancakeswap/swap-sdk-core'
import invariant from 'tiny-invariant'
import { parseNumberToFraction } from '@pancakeswap/utils/formatFractions'

import { maxLiquidityForAmounts } from './maxLiquidityForAmounts'
import { TickMath } from './tickMath'
import { PositionMath } from './positionMath'
import { ONE_HUNDRED_PERCENT, MAX_FEE, ZERO_PERCENT } from '../internalConstants'
import { Tick } from '../entities'
import { TickList } from './tickList'

export const FeeCalculator = {
  getEstimatedLPFee,
  getEstimatedLPFeeByAmounts,
  getLiquidityFromTick,
  getLiquidityFromSqrtRatioX96,
  getAverageLiquidity,
  getLiquidityBySingleAmount,
  getDependentAmount,
  getLiquidityByAmountsAndPrice,
  getAmountsByLiquidityAndPrice,
  getAmountsAtNewPrice,
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
  sqrtRatioX96: bigint
  // Most active liquidity of the pool
  mostActiveLiquidity: bigint
  // Fee tier of the pool, in hundreds of a bip, i.e. 1e-6
  fee: number

  // Proportion of time in future 24 hours when price staying inside given tick range
  insidePercentage?: Percent

  // Proportion of protocol fee
  protocolFee?: Percent
}

export function getEstimatedLPFeeWithProtocolFee({ amount, currency, ...rest }: EstimateFeeOptions) {
  return getEstimatedLPFeeByAmountsWithProtocolFee({
    ...rest,
    amountA: amount,
    amountB: CurrencyAmount.fromRawAmount(currency, MaxUint256),
  })
}

export function getEstimatedLPFee({ amount, currency, ...rest }: EstimateFeeOptions) {
  return getEstimatedLPFeeByAmounts({
    ...rest,
    amountA: amount,
    amountB: CurrencyAmount.fromRawAmount(currency, MaxUint256),
  })
}

interface EstimateFeeByAmountsOptions extends Omit<EstimateFeeOptions, 'amount' | 'currency'> {
  amountA: CurrencyAmount<Currency>
  amountB: CurrencyAmount<Currency>
}

export function getEstimatedLPFeeByAmountsWithProtocolFee(options: EstimateFeeByAmountsOptions) {
  try {
    return tryGetEstimatedLPFeeByAmounts(options)
  } catch (e) {
    console.error(e)
    return new Fraction(ZERO)
  }
}

export function getEstimatedLPFeeByAmounts({ protocolFee = ZERO_PERCENT, ...rest }: EstimateFeeByAmountsOptions) {
  try {
    const fee = tryGetEstimatedLPFeeByAmounts(rest)
    return ONE_HUNDRED_PERCENT.subtract(protocolFee).multiply(fee).asFraction
  } catch (e) {
    console.error(e)
    return new Fraction(ZERO)
  }
}

function tryGetEstimatedLPFeeByAmounts({
  amountA,
  amountB,
  volume24H,
  sqrtRatioX96,
  tickLower,
  tickUpper,
  mostActiveLiquidity,
  fee,
  insidePercentage = ONE_HUNDRED_PERCENT,
}: EstimateFeeByAmountsOptions): Fraction {
  invariant(!Number.isNaN(fee) && fee >= 0, 'INVALID_FEE')

  const tickCurrent = TickMath.getTickAtSqrtRatio(sqrtRatioX96)
  if (tickCurrent < tickLower || tickCurrent >= tickUpper) {
    return new Fraction(ZERO)
  }

  const liquidity = FeeCalculator.getLiquidityByAmountsAndPrice({
    amountA,
    amountB,
    tickUpper,
    tickLower,
    sqrtRatioX96,
  })

  if (!liquidity) {
    return new Fraction(ZERO)
  }

  const volumeInFraction = parseNumberToFraction(volume24H) || new Fraction(ZERO)
  return insidePercentage
    .multiply(volumeInFraction.multiply(BigInt(fee)).multiply(liquidity))
    .divide(MAX_FEE * (liquidity + mostActiveLiquidity)).asFraction
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
  sqrtRatioX96: bigint
}

export function getDependentAmount(options: GetAmountOptions) {
  const { currency, amount, sqrtRatioX96, tickLower, tickUpper } = options
  const currentTick = TickMath.getTickAtSqrtRatio(sqrtRatioX96)
  const liquidity = FeeCalculator.getLiquidityBySingleAmount(options)
  const isToken0 = currency.wrapped.sortsBefore(amount.currency.wrapped)
  const getTokenAmount = isToken0 ? PositionMath.getToken0Amount : PositionMath.getToken1Amount
  if (!liquidity) {
    return undefined
  }

  return CurrencyAmount.fromRawAmount(
    currency,
    getTokenAmount(currentTick, tickLower, tickUpper, sqrtRatioX96, liquidity)
  )
}

export function getLiquidityBySingleAmount({ amount, currency, ...rest }: GetAmountOptions): bigint | undefined {
  return getLiquidityByAmountsAndPrice({
    amountA: amount,
    amountB: CurrencyAmount.fromRawAmount(currency, MaxUint256),
    ...rest,
  })
}

interface GetLiquidityOptions extends Omit<GetAmountOptions, 'amount' | 'currency'> {
  amountA: CurrencyAmount<Currency>
  amountB: CurrencyAmount<Currency>
}

export function getLiquidityByAmountsAndPrice({
  amountA,
  amountB,
  tickUpper,
  tickLower,
  sqrtRatioX96,
}: GetLiquidityOptions) {
  const isToken0 =
    amountA.currency.wrapped.address !== amountB.currency.wrapped.address
      ? amountA.currency.wrapped.sortsBefore(amountB.currency.wrapped)
      : true
  const [inputAmount0, inputAmount1] = isToken0
    ? [amountA.quotient, amountB.quotient]
    : [amountB.quotient, amountA.quotient]
  const sqrtRatioAX96 = TickMath.getSqrtRatioAtTick(tickLower)
  const sqrtRatioBX96 = TickMath.getSqrtRatioAtTick(tickUpper)
  try {
    return maxLiquidityForAmounts(sqrtRatioX96, sqrtRatioAX96, sqrtRatioBX96, inputAmount0, inputAmount1, true)
  } catch (e) {
    console.error(e)
    return undefined
  }
}

interface GetAmountsOptions extends Omit<GetAmountOptions, 'amount' | 'currency'> {
  currencyA: Currency
  currencyB: Currency
  liquidity: bigint
}

export function getAmountsByLiquidityAndPrice(options: GetAmountsOptions) {
  const { currencyA, currencyB, liquidity, sqrtRatioX96, tickLower, tickUpper } = options
  const currentTick = TickMath.getTickAtSqrtRatio(sqrtRatioX96)
  const isToken0 = currencyA.wrapped.sortsBefore(currencyB.wrapped)
  const adjustedAmount0 = PositionMath.getToken0Amount(currentTick, tickLower, tickUpper, sqrtRatioX96, liquidity)
  const adjustedAmount1 = PositionMath.getToken1Amount(currentTick, tickLower, tickUpper, sqrtRatioX96, liquidity)
  return [
    CurrencyAmount.fromRawAmount(currencyA, isToken0 ? adjustedAmount0 : adjustedAmount1),
    CurrencyAmount.fromRawAmount(currencyB, isToken0 ? adjustedAmount1 : adjustedAmount0),
  ]
}

interface GetAmountsAtNewPriceOptions extends Omit<GetAmountOptions, 'amount' | 'currency'> {
  amountA: CurrencyAmount<Currency>
  amountB: CurrencyAmount<Currency>
  newSqrtRatioX96: bigint
}

export function getAmountsAtNewPrice({ newSqrtRatioX96, ...rest }: GetAmountsAtNewPriceOptions) {
  const { tickLower, tickUpper, amountA, amountB } = rest
  const liquidity = FeeCalculator.getLiquidityByAmountsAndPrice(rest)
  if (!liquidity) {
    return undefined
  }

  return FeeCalculator.getAmountsByLiquidityAndPrice({
    liquidity,
    currencyA: amountA.currency,
    currencyB: amountB.currency,
    tickLower,
    tickUpper,
    sqrtRatioX96: newSqrtRatioX96,
  })
}

export function getAverageLiquidity(ticks: Tick[], tickSpacing: number, tickLower: number, tickUpper: number): bigint {
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
  const getWeightedLFromLastTickTo = (toTick: number) => currentL * BigInt(toTick - Math.max(lastTick.index, tickLower))
  while (currentTick.index < tickUpper) {
    weightedL += getWeightedLFromLastTickTo(currentTick.index)
    currentL += currentTick.liquidityNet
    lastTick = currentTick

    // Tick upper is out of initialized tick range
    if (currentTick.index === ticks[ticks.length - 1].index) {
      break
    }

    currentTick = TickList.nextInitializedTick(ticks, currentTick.index, false)
  }
  weightedL += getWeightedLFromLastTickTo(tickUpper)

  return weightedL / BigInt(tickUpper - tickLower)
}

export function getLiquidityFromSqrtRatioX96(ticks: Tick[], sqrtRatioX96: bigint): bigint {
  const tick = TickMath.getTickAtSqrtRatio(sqrtRatioX96)
  return FeeCalculator.getLiquidityFromTick(ticks, tick)
}

export function getLiquidityFromTick(ticks: Tick[], tick: number): bigint {
  // calculate a cumulative of liquidityNet from all ticks that poolTicks[i] <= tick
  let liquidity = ZERO

  if (!ticks?.length) return liquidity

  if (tick < ticks[0].index || tick > ticks[ticks.length - 1].index) {
    return liquidity
  }

  for (let i = 0; i < ticks.length - 1; ++i) {
    liquidity += ticks[i].liquidityNet

    const lowerTick = ticks[i].index
    const upperTick = ticks[i + 1]?.index

    if (lowerTick <= tick && tick <= upperTick) {
      break
    }
  }

  return liquidity
}
