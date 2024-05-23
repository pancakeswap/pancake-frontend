import { CurrencyAmount, Token } from '@pancakeswap/sdk'
import invariant from 'tiny-invariant'
import { TICK_SPACINGS } from '../constants'
import { NEGATIVE_ONE, ONE, ZERO } from '../internalConstants'
import { LiquidityMath, SwapMath, TickMath } from '../utils'
import { PoolState } from './getPool'
import { hasInvolvedCurrency } from './hasInvolvedCurrency'

interface StepComputations {
  sqrtPriceStartX96: bigint
  tickNext: number
  initialized: boolean
  sqrtPriceNextX96: bigint
  amountIn: bigint
  amountOut: bigint
  feeAmount: bigint
}

export const swap = async ({
  pool,
  zeroForOne,
  amountSpecified,
  sqrtPriceLimitX96,
}: {
  pool: PoolState
  zeroForOne: boolean
  amountSpecified: bigint
  sqrtPriceLimitX96?: bigint
}): Promise<{
  amountCalculated: bigint
  sqrtRatioX96: bigint
  liquidity: bigint
  tickCurrent: number
  amountSpecifiedRemaining: bigint
}> => {
  if (!sqrtPriceLimitX96) sqrtPriceLimitX96 = zeroForOne ? TickMath.MIN_SQRT_RATIO + ONE : TickMath.MAX_SQRT_RATIO - ONE

  const tickSpacing = TICK_SPACINGS[pool.fee]

  if (zeroForOne) {
    invariant(sqrtPriceLimitX96 > TickMath.MIN_SQRT_RATIO, 'RATIO_MIN')
    invariant(sqrtPriceLimitX96 < pool.sqrtRatioX96, 'RATIO_CURRENT')
  } else {
    invariant(sqrtPriceLimitX96 < TickMath.MAX_SQRT_RATIO, 'RATIO_MAX')
    invariant(sqrtPriceLimitX96 > pool.sqrtRatioX96, 'RATIO_CURRENT')
  }

  const exactInput = amountSpecified >= ZERO

  // keep track of swap state

  const state = {
    amountSpecifiedRemaining: amountSpecified,
    amountCalculated: ZERO,
    sqrtPriceX96: pool.sqrtRatioX96,
    tick: pool.tick,
    liquidity: pool.liquidity,
  }

  // start swap while loop
  // start swap while loop
  while (state.amountSpecifiedRemaining !== ZERO && state.sqrtPriceX96 != sqrtPriceLimitX96) {
    const step: Partial<StepComputations> = {}
    step.sqrtPriceStartX96 = state.sqrtPriceX96

    // because each iteration of the while loop rounds, we can't optimize this code (relative to the smart contract)
    // by simply traversing to the next available tick, we instead need to exactly replicate
    // tickBitmap.nextInitializedTickWithinOneWord
    ;[step.tickNext, step.initialized] = await pool.tickDataProvider.nextInitializedTickWithinOneWord(
      state.tick,
      zeroForOne,
      tickSpacing
    )

    if (step.tickNext < TickMath.MIN_TICK) {
      step.tickNext = TickMath.MIN_TICK
    } else if (step.tickNext > TickMath.MAX_TICK) {
      step.tickNext = TickMath.MAX_TICK
    }

    step.sqrtPriceNextX96 = TickMath.getSqrtRatioAtTick(step.tickNext)
    ;[state.sqrtPriceX96, step.amountIn, step.amountOut, step.feeAmount] = SwapMath.computeSwapStep(
      state.sqrtPriceX96,
      (zeroForOne ? step.sqrtPriceNextX96 < sqrtPriceLimitX96 : step.sqrtPriceNextX96 > sqrtPriceLimitX96)
        ? sqrtPriceLimitX96
        : step.sqrtPriceNextX96,
      state.liquidity,
      state.amountSpecifiedRemaining,
      pool.fee
    )

    if (exactInput) {
      state.amountSpecifiedRemaining -= step.amountIn! + step.feeAmount!
      state.amountCalculated = state.amountCalculated! - step.amountOut!
    } else {
      state.amountSpecifiedRemaining = state.amountSpecifiedRemaining! + step.amountOut!
      state.amountCalculated = state.amountCalculated! + (step.amountIn! + step.feeAmount!)
    }

    // TODO
    if (state.sqrtPriceX96 === step.sqrtPriceNextX96) {
      // if the tick is initialized, run the tick transition
      if (step.initialized) {
        let liquidityNet = BigInt((await pool.tickDataProvider.getTick(step.tickNext)).liquidityNet)
        // if we're moving leftward, we interpret liquidityNet as the opposite sign
        // safe because liquidityNet cannot be type(int128).min
        if (zeroForOne) liquidityNet *= NEGATIVE_ONE

        state.liquidity = LiquidityMath.addDelta(state.liquidity, liquidityNet)
      }

      state.tick = zeroForOne ? step.tickNext - 1 : step.tickNext
    } else if (state.sqrtPriceX96 !== step.sqrtPriceStartX96) {
      // updated comparison function
      // recompute unless we're on a lower tick boundary (i.e. already transitioned ticks), and haven't moved
      state.tick = TickMath.getTickAtSqrtRatio(state.sqrtPriceX96)
    }
  }

  return {
    amountSpecifiedRemaining: state.amountSpecifiedRemaining,
    amountCalculated: state.amountCalculated,
    sqrtRatioX96: state.sqrtPriceX96,
    liquidity: state.liquidity,
    tickCurrent: state.tick,
  }
}

/**
 * Given an input amount of a token, return the computed output amount, and a pool with state updated after the trade
 *
 */
export const getOutputAmount = async (
  pool: PoolState,
  inputAmount: CurrencyAmount<Token>,
  sqrtPriceLimitX96?: bigint
): Promise<[CurrencyAmount<Token>, PoolState]> => {
  invariant(hasInvolvedCurrency(pool, inputAmount.currency), 'TOKEN')

  const zeroForOne = inputAmount.currency.equals(pool.currency0)

  const {
    amountCalculated: outputAmount,
    sqrtRatioX96,
    liquidity,
    tickCurrent,
  } = await swap({
    pool,
    zeroForOne,
    amountSpecified: inputAmount.quotient,
    sqrtPriceLimitX96,
  })
  const outputToken = zeroForOne ? pool.currency1 : pool.currency0

  return [
    CurrencyAmount.fromRawAmount(outputToken, outputAmount * NEGATIVE_ONE),
    {
      ...pool,
      sqrtRatioX96,
      liquidity,
      tick: tickCurrent,
    },
  ]
}

/**
 * Given a desired output amount of a token, return the computed input amount and a pool with state updated after the trade
 */
export const getInputAmount = async (
  pool: PoolState,
  outputAmount: CurrencyAmount<Token>,
  sqrtPriceLimitX96?: bigint
): Promise<[CurrencyAmount<Token>, PoolState]> => {
  invariant(outputAmount.currency.isToken && hasInvolvedCurrency(pool, outputAmount.currency), 'CURRENCY')

  const zeroForOne = outputAmount.currency.equals(pool.currency1)

  const {
    amountCalculated: inputAmount,
    sqrtRatioX96,
    liquidity,
    tickCurrent,
  } = await swap({
    pool,
    zeroForOne,
    amountSpecified: outputAmount.quotient * NEGATIVE_ONE,
    sqrtPriceLimitX96,
  })

  const inputToken = zeroForOne ? pool.currency0 : pool.currency1

  return [
    CurrencyAmount.fromRawAmount(inputToken, inputAmount),
    {
      ...pool,
      sqrtRatioX96,
      liquidity,
      tick: tickCurrent,
    },
  ]
}

/**
 * Given a desired output amount of a token, return the computed input amount and a pool with state updated after the trade
 */
export const getInputAmountByExactOut = async (
  pool: PoolState,
  outputAmount: CurrencyAmount<Token>,
  sqrtPriceLimitX96?: bigint
): Promise<[CurrencyAmount<Token>, PoolState]> => {
  invariant(outputAmount.currency.isToken && hasInvolvedCurrency(pool, outputAmount.currency), 'CURRENCY')

  const zeroForOne = outputAmount.currency.equals(pool.currency1)

  const {
    amountCalculated: inputAmount,
    sqrtRatioX96,
    liquidity,
    tickCurrent,
  } = await swap({
    pool,
    zeroForOne,
    amountSpecified: outputAmount.quotient * NEGATIVE_ONE,
    sqrtPriceLimitX96,
  })

  const inputToken = zeroForOne ? pool.currency0 : pool.currency1

  return [
    CurrencyAmount.fromRawAmount(inputToken, inputAmount),
    {
      ...pool,
      sqrtRatioX96,
      liquidity,
      tick: tickCurrent,
    },
  ]
}
