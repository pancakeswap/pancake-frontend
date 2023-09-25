import { BigintIsh, Currency, CurrencyAmount, Fraction, ONE, Percent, Token, TradeType, sqrt } from '@pancakeswap/sdk'
import { BigNumber } from 'bignumber.js'
import { BaseRoute, Pool, PoolType, Route, RouteType, SmartRouterTrade, StablePool, V2Pool, V3Pool } from './types'
import { Hex, encodePacked } from 'viem'
import { V2_FEE_PATH_PLACEHOLDER } from '@pancakeswap/smart-router/evm'

export function hexToDecimalString(hex: any) {
  return new BigNumber(hex).toString()
}

export function encodeSqrtRatioX96(amount1: BigintIsh, amount0: BigintIsh): bigint {
  const numerator = BigInt(amount1) << 192n
  const denominator = BigInt(amount0)
  const ratioX192 = numerator / denominator
  return sqrt(ratioX192)
}

function getRouteTypeFromPool(pool: Pool) {
  switch (pool.type) {
    case PoolType.V2:
      return RouteType.V2
    case PoolType.V3:
      return RouteType.V3
    case PoolType.STABLE:
      return RouteType.STABLE
    default:
      return RouteType.MIXED
  }
}

export const partitionMixedRouteByProtocol = (route: Route): Pool[][] => {
  const acc: Pool[][] = []

  let left = 0
  let right = 0
  while (right < route.pools.length) {
    if (route.pools[left].type !== route.pools[right].type) {
      acc.push(route.pools.slice(left, right))
      left = right
    }
    // seek forward with right pointer
    right++
    if (right === route.pools.length) {
      /// we reached the end, take the rest
      acc.push(route.pools.slice(left, right))
    }
  }
  return acc
}

export const getOutputOfPools = (pools: Pool[], firstInputToken: Currency): Currency => {
  const { inputToken: outputToken } = pools.reduce(
    ({ inputToken }, pool: Pool): { inputToken: Currency } => {
      if (!involvesCurrency(pool, inputToken)) throw new Error('PATH')
      const output = getOutputCurrency(pool, inputToken)
      return {
        inputToken: output,
      }
    },
    { inputToken: firstInputToken }
  )
  return outputToken
}

export function buildBaseRoute(pools: Pool[], currencyIn: Currency, currencyOut: Currency): BaseRoute {
  const path: Currency[] = [currencyIn.wrapped]
  let prevIn = path[0]
  let routeType: RouteType | null = null
  const updateRouteType = (pool: Pool, currentRouteType: RouteType | null) => {
    if (currentRouteType === null) {
      return getRouteTypeFromPool(pool)
    }
    if (currentRouteType === RouteType.MIXED || currentRouteType !== getRouteTypeFromPool(pool)) {
      return RouteType.MIXED
    }
    return currentRouteType
  }
  for (const pool of pools) {
    prevIn = getOutputCurrency(pool, prevIn)
    path.push(prevIn)
    routeType = updateRouteType(pool, routeType)
  }

  if (routeType === null) {
    throw new Error(`Invalid route type when constructing base route`)
  }

  return {
    path,
    pools,
    type: routeType,
    input: currencyIn,
    output: currencyOut,
  }
}
export function isV2Pool(pool: Pool): pool is V2Pool {
  return pool.type === PoolType.V2
}

export function isV3Pool(pool: Pool): pool is V3Pool {
  return pool.type === PoolType.V3
}

export function isStablePool(pool: Pool): pool is StablePool {
  return pool.type === PoolType.STABLE && pool.balances.length >= 2
}

export function involvesCurrency(pool: Pool, currency: Currency) {
  const token = currency.wrapped
  if (isV2Pool(pool)) {
    const { reserve0, reserve1 } = pool
    return reserve0.currency.equals(token) || reserve1.currency.equals(token)
  }
  if (isV3Pool(pool)) {
    const { token0, token1 } = pool
    return token0.equals(token) || token1.equals(token)
  }
  if (isStablePool(pool)) {
    const { balances } = pool
    return balances.some((b) => b.currency.equals(token))
  }
  return false
}

// FIXME current verison is not working with stable pools that have more than 2 tokens
export function getOutputCurrency(pool: Pool, currencyIn: Currency): Currency {
  const tokenIn = currencyIn.wrapped
  if (isV2Pool(pool)) {
    const { reserve0, reserve1 } = pool
    return reserve0.currency.equals(tokenIn) ? reserve1.currency : reserve0.currency
  }
  if (isV3Pool(pool)) {
    const { token0, token1 } = pool
    return token0.equals(tokenIn) ? token1 : token0
  }
  if (isStablePool(pool)) {
    const { balances } = pool
    return balances[0].currency.equals(tokenIn) ? balances[1].currency : balances[0].currency
  }
  throw new Error('Cannot get output currency by invalid pool')
}

/**
 * Converts a route to a hex encoded path
 * @param route the mixed path to convert to an encoded path
 * @returns the encoded path
 */
export function encodeMixedRouteToPath(route: BaseRoute, exactOutput: boolean): Hex {
  const firstInputToken: Token = route.input.wrapped

  const { path, types } = route.pools.reduce(
    (
      // eslint-disable-next-line @typescript-eslint/no-shadow
      { inputToken, path, types }: { inputToken: Token; path: (string | number)[]; types: string[] },
      pool: Pool,
      index
    ): { inputToken: Token; path: (string | number)[]; types: string[] } => {
      const outputToken = getOutputCurrency(pool, inputToken).wrapped
      const fee = isV3Pool(pool) ? pool.fee : V2_FEE_PATH_PLACEHOLDER
      if (index === 0) {
        return {
          inputToken: outputToken,
          types: ['address', 'uint24', 'address'],
          path: [inputToken.address, fee, outputToken.address],
        }
      }
      return {
        inputToken: outputToken,
        types: [...types, 'uint24', 'address'],
        path: [...path, fee, outputToken.address],
      }
    },
    { inputToken: firstInputToken, path: [], types: [] }
  )

  // @ts-ignore
  return exactOutput ? encodePacked(types.reverse(), path.reverse()) : encodePacked(types, path)
}

export function maximumAmountIn(trade: SmartRouterTrade<TradeType>, slippage: Percent, amountIn = trade.inputAmount) {
  if (trade.tradeType === TradeType.EXACT_INPUT) {
    return amountIn
  }

  const slippageAdjustedAmountIn = new Fraction(ONE).add(slippage).multiply(amountIn.quotient).quotient
  return CurrencyAmount.fromRawAmount(amountIn.currency, slippageAdjustedAmountIn)
}

export function minimumAmountOut(
  trade: SmartRouterTrade<TradeType>,
  slippage: Percent,
  amountOut = trade.outputAmount
) {
  if (trade.tradeType === TradeType.EXACT_OUTPUT) {
    return amountOut
  }
  const slippageAdjustedAmountOut = new Fraction(ONE).add(slippage).invert().multiply(amountOut.quotient).quotient
  return CurrencyAmount.fromRawAmount(amountOut.currency, amountOut.quotient / 100000000n)
}