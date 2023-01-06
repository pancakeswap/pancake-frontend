import { Currency, CurrencyAmount, JSBI, MaxUint256, Percent, Fraction } from '@pancakeswap/swap-sdk-core'
import invariant from 'tiny-invariant'

import { maxLiquidityForAmounts } from './maxLiquidityForAmounts'
import { TickMath } from './tickMath'
import { Q128 } from '../constants'

type Amounts = [CurrencyAmount<Currency>, CurrencyAmount<Currency>]

interface EstimateFeeOptions {
  // Amount of token user input
  amount: CurrencyAmount<Currency>
  // Currency of the other token in the pool
  currency: Currency
  tickLower: number
  tickUpper: number

  // The reason of using price sqrt X96 instead of tick current is that
  // tick current may have rounding error since it's a floor rounding
  sqrtRatioX96: JSBI

  feeGrowthGlobalsCurrent: [JSBI, JSBI]
  feeGrowthGlobalsLast: [JSBI, JSBI]

  secondsInside: number
}

interface OptionsWithDuration extends EstimateFeeOptions {
  // Measured in seconds
  duration: number
}

// interface ForecastAprOptions {
//   tickLower: number
//   tickUpper: number
//   sqrtRatioX96: JSBI
//   feeGrowthGlobalsCurrent: [JSBI, JSBI]
//   feeGrowthGlobalsLast: [JSBI, JSBI]
//   secondsInside: number
// }
//
// interface ForecastAprOptionsWithDuration extends ForecastAprOption {
//   // Measured in seconds
//   duration: number
// }

function getFeeAmount(
  feeGrowthCurrent: JSBI,
  feeGrowthLast: JSBI,
  liquidity: JSBI,
  insideProportion: Percent
): Fraction {
  invariant(JSBI.lessThanOrEqual(feeGrowthLast, feeGrowthCurrent), 'ACCUMULATED_FEE_GROWTH')
  return insideProportion
    .multiply(JSBI.multiply(JSBI.subtract(feeGrowthCurrent, feeGrowthLast), liquidity))
    .divide(Q128)
}

export function getEstimatedLPFees({
  amount,
  currency,
  sqrtRatioX96,
  tickLower,
  tickUpper,
  feeGrowthGlobalsCurrent,
  feeGrowthGlobalsLast,
  secondsInside,
  duration,
}: OptionsWithDuration): Amounts {
  invariant(secondsInside <= duration, 'SECONDS_INSIDE_OUT_OF_BOUND')
  const insideProportion = new Percent(secondsInside, duration)

  const [feeGrowthGlobal0, feeGrowthGlobal1] = feeGrowthGlobalsCurrent
  const [feeGrowthGlobal0Last, feeGrowthGlobal1Last] = feeGrowthGlobalsLast

  const isToken0 = amount.currency.wrapped.sortsBefore(currency.wrapped)
  const [currency0, currency1] = isToken0 ? [amount.currency, currency] : [currency, amount.currency]
  const [inputAmount0, inputAmount1] = isToken0 ? [amount.quotient, MaxUint256] : [MaxUint256, amount.quotient]
  const sqrtRatioAX96 = TickMath.getSqrtRatioAtTick(tickLower)
  const sqrtRatioBX96 = TickMath.getSqrtRatioAtTick(tickUpper)
  const liquidity = maxLiquidityForAmounts(sqrtRatioX96, sqrtRatioAX96, sqrtRatioBX96, inputAmount0, inputAmount1, true)
  const fee0 = getFeeAmount(feeGrowthGlobal0, feeGrowthGlobal0Last, liquidity, insideProportion)
  const fee1 = getFeeAmount(feeGrowthGlobal1, feeGrowthGlobal1Last, liquidity, insideProportion)
  return [
    CurrencyAmount.fromFractionalAmount(currency0, fee0.numerator, fee0.denominator),
    CurrencyAmount.fromFractionalAmount(currency1, fee1.numerator, fee1.denominator),
  ]
}

export function getEstimatedLPFees7d(options: EstimateFeeOptions) {
  return getEstimatedLPFees({
    ...options,
    duration: 60 * 60 * 24 * 7,
  })
}
