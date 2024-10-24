import { Currency, Pair, Price } from '@pancakeswap/sdk'
import { Pool as SDKV3Pool, computePoolAddress } from '@pancakeswap/v3-sdk'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import { getSwapOutput } from '@pancakeswap/stable-swap-sdk'
import memoize from 'lodash/memoize.js'
import { Address } from 'viem'

import { Pool, PoolType, StablePool, V2Pool, V3Pool, V4BinPool, V4ClPool } from '../types'

export function isV2Pool(pool: Pool): pool is V2Pool {
  return pool.type === PoolType.V2
}

export function isV3Pool(pool: Pool): pool is V3Pool {
  return pool.type === PoolType.V3
}

export function isStablePool(pool: Pool): pool is StablePool {
  return pool.type === PoolType.STABLE && pool.balances.length >= 2
}

export function isV4BinPool(pool: Pool): pool is V4BinPool {
  return pool.type === PoolType.V4BIN
}

export function isV4ClPool(pool: Pool): pool is V4ClPool {
  return pool.type === PoolType.V4CL
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
  if (isV4ClPool(pool) || isV4BinPool(pool)) {
    const { currency0, currency1 } = pool
    return (
      currency0.equals(currency) ||
      currency1.equals(currency) ||
      currency0.wrapped.equals(token) ||
      currency1.wrapped.equals(token)
    )
  }
  if (isStablePool(pool)) {
    const { balances } = pool
    return balances.some((b) => b.currency.equals(token))
  }
  return false
}

// FIXME: current version is not working with stable pools that have more than 2 tokens
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
  if (isV4ClPool(pool) || isV4BinPool(pool)) {
    const { currency0, currency1 } = pool
    return currency0.wrapped.equals(tokenIn) ? currency1 : currency0
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
      : isV3Pool(pool)
      ? [pool.token0.wrapped, pool.token1.wrapped]
      : [pool.currency0, pool.currency1]
    const fee = isV3Pool(pool) ? pool.fee : 'V2_FEE'
    return `${pool.type}_${token0.chainId}_${token0.isNative}_${token0.wrapped.address}_${token1.isNative}_${token1.wrapped.address}_${fee}`
  },
)

export function getTokenPrice(pool: Pool, base: Currency, quote: Currency): Price<Currency, Currency> {
  if (isV3Pool(pool)) {
    const { token0, token1, fee, liquidity, sqrtRatioX96, tick } = pool
    const v3Pool = new SDKV3Pool(token0.wrapped, token1.wrapped, fee, sqrtRatioX96, liquidity, tick)
    return v3Pool.priceOf(base.wrapped)
  }

  if (isV4ClPool(pool)) {
    const { currency0, currency1, fee, liquidity, sqrtRatioX96, tick } = pool
    const v3Pool = new SDKV3Pool(currency0.wrapped, currency1.wrapped, fee, sqrtRatioX96, liquidity, tick)
    const tokenPrice = v3Pool.priceOf(base.wrapped)
    return new Price(base, quote, tokenPrice.denominator, tokenPrice.numerator)
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
    const quoteOut = getSwapOutput({
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
