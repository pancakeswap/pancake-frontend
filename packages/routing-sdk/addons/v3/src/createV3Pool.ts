import { Currency, CurrencyAmount, Price, ONE, ZERO } from '@pancakeswap/swap-sdk-core'
import { logCurrency } from '@pancakeswap/routing-sdk'
import {
  encodeSqrtRatioX96,
  TickList,
  TickMath,
  SwapMath,
  LiquidityMath,
  TICK_SPACINGS,
  FeeAmount,
} from '@pancakeswap/v3-sdk'
import invariant from 'tiny-invariant'
import memoize from 'lodash/memoize.js'

import type { V3Pool, V3PoolData } from './types'
import { BASE_SWAP_COST_V3, COST_PER_HOP_V3, COST_PER_INIT_TICK, NEGATIVE_ONE, Q192, V3_POOL_TYPE } from './constants'

export function createV3Pool(params: V3PoolData): V3Pool {
  let p = { ...params, type: V3_POOL_TYPE }
  const tickSpacing = p.tickSpacing ?? TICK_SPACINGS[p.fee as FeeAmount]
  invariant(Boolean(tickSpacing) === true, 'Invalid fee for v3 pool')

  const pool: V3Pool = {
    type: V3_POOL_TYPE,
    swapToPrice: (price) => {
      const sortedPrice = price.baseCurrency.wrapped.sortsBefore(price.quoteCurrency.wrapped) ? price : price.invert()
      const sqrtRatioLimit = encodeSqrtRatioX96(sortedPrice.numerator, sortedPrice.denominator)
      if (sqrtRatioLimit === p.sqrtRatioX96) {
        return {
          inputAmount: CurrencyAmount.fromRawAmount(p.token0, 0n),
        }
      }
      const zeroForOne = sqrtRatioLimit < p.sqrtRatioX96
      const outputReserve = zeroForOne ? p.reserve1 : p.reserve0
      const outputCurrency = zeroForOne ? p.token1 : p.token0
      const outputAmount = CurrencyAmount.fromRawAmount(outputCurrency.wrapped, outputReserve?.quotient ?? 0n)
      const [inputAmount] = getInputAmount(outputAmount, {
        ...p,
        sqrtPriceLimitX96: sqrtRatioLimit,
      })
      return {
        inputAmount,
      }
    },
    getReserve: (c) =>
      p.token0.wrapped.equals(c.wrapped)
        ? p.reserve0 ?? CurrencyAmount.fromRawAmount(p.token0, 0n)
        : p.reserve1 ?? CurrencyAmount.fromRawAmount(p.token1, 0n),
    getCurrentPrice: (base) => {
      return priceOf(p, base.wrapped)
    },
    getTradingPairs: () => [[p.token0, p.token1]],
    getId: () => p.address,
    update: (poolData) => {
      p = { ...p, ...poolData }
    },
    log: () =>
      `V3 ${p.token0.symbol} - ${p.token1.symbol} (${p.fee}) - ${p.address} - price ${token0Price(p).toSignificant(
        6,
      )} ${p.token1.symbol}/${p.token0.symbol}`,

    getPoolData: () => p,

    getQuote: ({ amount, isExactIn }) => {
      const { ticks } = p
      if (!ticks?.length) {
        return undefined
      }
      try {
        const [quote, poolAfter] = isExactIn
          ? getOutputAmount(amount.wrapped, p)
          : getInputAmount(amount.wrapped, { ...p, exactOut: true })

        // Not enough liquidity to perform the swap
        if (quote.quotient <= 0n) {
          return undefined
        }

        const { tick: tickAfter } = poolAfter
        const newPool: V3PoolData = {
          ...p,
          tick: tickAfter,
          sqrtRatioX96: poolAfter.sqrtRatioX96,
          liquidity: poolAfter.liquidity,
        }
        return {
          poolAfter: createV3Pool(newPool),
          quote,
          pool,
        }
      } catch (e) {
        // console.warn('No enough liquidity to perform swap', e)
        return undefined
      }
    },

    estimateGasCostForQuote: ({ poolAfter }) => {
      const { tick, ticks, token0 } = p
      const { chainId } = token0
      const { tick: tickAfter } = poolAfter.getPoolData()
      invariant(ticks !== undefined, '[Estimate gas]: No valid tick list found')
      const numOfTicksCrossed = TickList.countInitializedTicksCrossed(ticks, tick, tickAfter)
      const tickGasUse = COST_PER_INIT_TICK(chainId) * BigInt(numOfTicksCrossed)
      return BASE_SWAP_COST_V3(chainId) + COST_PER_HOP_V3(chainId) + tickGasUse
    },
  }

  return pool
}

/**
 * Returns the current mid price of the pool in terms of token0, i.e. the ratio of token1 over token0
 */
const token0Price = memoize(
  ({
    token0,
    token1,
    sqrtRatioX96,
  }: Pick<V3PoolData, 'token0' | 'token1' | 'sqrtRatioX96'>): Price<Currency, Currency> => {
    return new Price(token0, token1, Q192, sqrtRatioX96 * sqrtRatioX96)
  },
  ({ token0, token1, sqrtRatioX96 }) => `${logCurrency(token0)}_${logCurrency(token1)}_${sqrtRatioX96}`,
)

const token1Price = memoize(
  ({
    token0,
    token1,
    sqrtRatioX96,
  }: Pick<V3PoolData, 'token0' | 'token1' | 'sqrtRatioX96'>): Price<Currency, Currency> => {
    return new Price(token1, token0, sqrtRatioX96 * sqrtRatioX96, Q192)
  },
  ({ token0, token1, sqrtRatioX96 }) => `${logCurrency(token0)}_${logCurrency(token1)}_${sqrtRatioX96}`,
)

/**
 * Return the price of the given token in terms of the other token in the pool.
 * @param token The token to return price of
 * @returns The price of the given token, in terms of the other.
 */
function priceOf(
  p: Pick<V3PoolData, 'token0' | 'token1' | 'sqrtRatioX96'>,
  token: Currency,
): Price<Currency, Currency> {
  invariant(involvesToken(p, token), 'TOKEN')
  return token.equals(p.token0) ? token0Price(p) : token1Price(p)
}

type SwapBaseParams = Omit<V3PoolData, 'reserve0' | 'reserve1' | 'address'> & {
  sqrtPriceLimitX96?: bigint
}

type SwapParams = SwapBaseParams & {
  zeroForOne: boolean
  amountSpecified: bigint
  tickSpacing: number
}

type StepComputations = {
  sqrtPriceStartX96: bigint
  tickNext: number
  initialized: boolean
  sqrtPriceNextX96: bigint
  amountIn: bigint
  amountOut: bigint
  feeAmount: bigint
}

/**
 * Returns true if the token is either token0 or token1
 * @param token The token to check
 * @returns True if token is either token0 or token
 */
function involvesToken(p: Pick<V3PoolData, 'token0' | 'token1'>, token: Currency): boolean {
  return token.equals(p.token0) || token.equals(p.token1)
}

/**
 * Given an input amount of a token, return the computed output amount, and a pool with state updated after the trade
 * @param inputAmount The input amount for which to quote the output amount
 * @param sqrtPriceLimitX96 The Q64.96 sqrt price limit
 * @returns The output amount and the pool with updated state
 */
function getOutputAmount(
  inputAmount: CurrencyAmount<Currency>,
  { sqrtPriceLimitX96, ...pool }: SwapBaseParams,
): [CurrencyAmount<Currency>, Omit<SwapBaseParams, 'sqrtPriceLimitX96'>] {
  invariant(involvesToken(pool, inputAmount.currency), 'TOKEN')
  const tickSpacing = pool.tickSpacing ?? TICK_SPACINGS[pool.fee as FeeAmount]
  invariant(!!tickSpacing, 'Invalid tick spacing')

  const zeroForOne = inputAmount.currency.equals(pool.token0)

  const {
    amountCalculated: outputAmount,
    sqrtRatioX96,
    liquidity,
    tickCurrent,
  } = swap({
    ...pool,
    tickSpacing,
    amountSpecified: inputAmount.quotient,
    zeroForOne,
    sqrtPriceLimitX96,
  })
  const outputToken = zeroForOne ? pool.token1 : pool.token0
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
 * @param outputAmount the output amount for which to quote the input amount
 * @param sqrtPriceLimitX96 The Q64.96 sqrt price limit. If zero for one, the price cannot be less than this value after the swap. If one for zero, the price cannot be greater than this value after the swap
 * @returns The input amount and the pool with updated state
 */
function getInputAmount(
  outputAmount: CurrencyAmount<Currency>,
  { sqrtPriceLimitX96, exactOut, ...pool }: SwapBaseParams & { exactOut?: boolean },
): [CurrencyAmount<Currency>, Omit<SwapBaseParams, 'sqrtPriceLimitX96'>] {
  invariant(outputAmount.currency.isToken && involvesToken(pool, outputAmount.currency), 'TOKEN')
  const tickSpacing = pool.tickSpacing ?? TICK_SPACINGS[pool.fee as FeeAmount]
  invariant(!!tickSpacing, 'Invalid tick spacing')

  const zeroForOne = outputAmount.currency.equals(pool.token1)

  const {
    amountSpecifiedRemaining,
    amountCalculated: inputAmount,
    sqrtRatioX96,
    liquidity,
    tickCurrent,
  } = swap({
    ...pool,
    tickSpacing,
    amountSpecified: outputAmount.quotient * NEGATIVE_ONE,
    zeroForOne,
    sqrtPriceLimitX96,
  })

  if (exactOut) {
    invariant(amountSpecifiedRemaining === 0n, 'INSUFFICIENT_LIQUIDITY_EXACT_OUT')
  }

  const inputToken = zeroForOne ? pool.token0 : pool.token1
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

function swap({
  fee,
  tickSpacing,
  ticks,
  tick: tickCurrent,
  liquidity,
  sqrtRatioX96,
  zeroForOne,
  amountSpecified,
  sqrtPriceLimitX96,
}: SwapParams): {
  amountCalculated: bigint
  sqrtRatioX96: bigint
  liquidity: bigint
  tickCurrent: number
  amountSpecifiedRemaining: bigint
} {
  invariant(ticks !== undefined, '[Swap]: No valid tick list found')
  // eslint-disable-next-line no-param-reassign
  if (!sqrtPriceLimitX96) sqrtPriceLimitX96 = zeroForOne ? TickMath.MIN_SQRT_RATIO + ONE : TickMath.MAX_SQRT_RATIO - ONE

  if (zeroForOne) {
    invariant(sqrtPriceLimitX96 > TickMath.MIN_SQRT_RATIO, 'RATIO_MIN')
    invariant(sqrtPriceLimitX96 < sqrtRatioX96, 'RATIO_CURRENT')
  } else {
    invariant(sqrtPriceLimitX96 < TickMath.MAX_SQRT_RATIO, 'RATIO_MAX')
    invariant(sqrtPriceLimitX96 > sqrtRatioX96, 'RATIO_CURRENT')
  }

  const exactInput = amountSpecified >= ZERO

  // keep track of swap state

  const state = {
    amountSpecifiedRemaining: amountSpecified,
    amountCalculated: ZERO,
    sqrtPriceX96: sqrtRatioX96,
    tick: tickCurrent,
    liquidity,
  }

  // start swap while loop
  while (state.amountSpecifiedRemaining !== ZERO && state.sqrtPriceX96 !== sqrtPriceLimitX96) {
    const step: Partial<StepComputations> = {}
    step.sqrtPriceStartX96 = state.sqrtPriceX96

    // because each iteration of the while loop rounds, we can't optimize this code (relative to the smart contract)
    // by simply traversing to the next available tick, we instead need to exactly replicate
    // tickBitmap.nextInitializedTickWithinOneWord
    ;[step.tickNext, step.initialized] = TickList.nextInitializedTickWithinOneWord(
      ticks,
      state.tick,
      zeroForOne,
      tickSpacing,
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
      fee,
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
        let liquidityNet = BigInt(TickList.getTick(ticks, step.tickNext).liquidityNet)
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
