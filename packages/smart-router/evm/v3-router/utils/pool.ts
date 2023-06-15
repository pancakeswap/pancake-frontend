import { Currency, Pair, Price } from '@pancakeswap/sdk'
import { Pool as SDKV3Pool, computePoolAddress } from '@pancakeswap/v3-sdk'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import memoize from 'lodash/memoize'
import { Address } from 'viem'

import * as StableSwap from '../../stableSwap'
import { Pool, PoolType, StablePool, V2Pool, V3Pool } from '../types'

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

export const computeV3PoolAddress = memoize(
  computePoolAddress,
  ({ deployerAddress, tokenA, tokenB, fee }) =>
    `${tokenA.chainId}_${deployerAddress}_${tokenA.address}_${tokenB.address}_${fee}`,
)

export const computeV2PoolAddress = memoize(
  Pair.getAddress,
  (tokenA, tokenB) => `${tokenA.chainId}_${tokenA.address}_${tokenB.address}`,
)

export const getPoolAddress = memoize(
  function getAddress(pool: Pool): Address | '' {
    if (isStablePool(pool) || isV3Pool(pool)) {
      return pool.address
    }
    if (isV2Pool(pool)) {
      const { reserve0, reserve1 } = pool
      return computeV2PoolAddress(reserve0.currency.wrapped, reserve1.currency.wrapped)
    }
    return ''
  },
  (pool) => {
    if (isStablePool(pool)) {
      const { balances } = pool
      const tokenAddresses = balances.map((b) => b.currency.wrapped.address)
      return `${pool.type}_${balances[0]?.currency.chainId}_${tokenAddresses.join('_')}`
    }
    const [token0, token1] = isV2Pool(pool)
      ? [pool.reserve0.currency.wrapped, pool.reserve1.currency.wrapped]
      : [pool.token0.wrapped, pool.token1.wrapped]
    return `${pool.type}_${token0.chainId}_${token0.address}_${token1.address}`
  },
)

export function getTokenPrice(pool: Pool, base: Currency, quote: Currency): Price<Currency, Currency> {
  if (isV3Pool(pool)) {
    const { token0, token1, fee, liquidity, sqrtRatioX96, tick } = pool
    const v3Pool = new SDKV3Pool(token0.wrapped, token1.wrapped, fee, sqrtRatioX96, liquidity, tick)
    return v3Pool.priceOf(base.wrapped)
  }

  if (isV2Pool(pool)) {
    const pair = new Pair(pool.reserve0.wrapped, pool.reserve1.wrapped)
    return pair.priceOf(base.wrapped)
  }

  // FIXME now assume price of stable pair is 1
  if (isStablePool(pool)) {
    const { amplifier, balances, fee } = pool
    const baseIn = tryParseAmount('1', base)
    if (!baseIn) {
      throw new Error(`Cannot parse amount for ${base.symbol}`)
    }
    const quoteOut = StableSwap.getSwapOutput({
      amplifier,
      balances,
      fee,
      outputCurrency: quote,
      amount: baseIn,
    })

    return new Price({
      baseAmount: baseIn,
      quoteAmount: quoteOut,
    })
  }
  return new Price(base, quote, 1n, 0n)
}
