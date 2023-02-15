import { ChainId, Currency, JSBI, Pair, Price } from '@pancakeswap/sdk'
import { computePoolAddress, Pool as SDKV3Pool, TickMath } from '@pancakeswap/v3-sdk'

import { Pool, PoolType, StablePool, V2Pool, V3Pool } from '../types'
import { V3_POOL_FACTORY_ADDRESS } from '../../constants'

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

export function getPoolAddress(pool: Pool): string {
  if (isStablePool(pool)) {
    return pool.address
  }
  if (isV2Pool(pool)) {
    const { reserve0, reserve1 } = pool
    return Pair.getAddress(reserve0.currency.wrapped, reserve1.currency.wrapped)
  }
  if (isV3Pool(pool)) {
    const { fee, token0, token1 } = pool
    // eslint-disable-next-line
    const chainId: ChainId = token0.chainId
    const factoryAddress = V3_POOL_FACTORY_ADDRESS[chainId]
    return computePoolAddress({
      factoryAddress,
      tokenA: token0.wrapped,
      tokenB: token1.wrapped,
      fee,
    })
  }
  return ''
}

export function getTokenPrice(pool: Pool, base: Currency, quote: Currency): Price<Currency, Currency> {
  if (isV3Pool(pool)) {
    const { token0, token1, fee, liquidity, sqrtRatioX96 } = pool
    const v3Pool = new SDKV3Pool(
      token0.wrapped,
      token1.wrapped,
      fee,
      sqrtRatioX96,
      liquidity,
      TickMath.getTickAtSqrtRatio(sqrtRatioX96),
    )
    return v3Pool.token0.equals(base.wrapped) ? v3Pool.token0Price : v3Pool.token1Price
  }

  if (isV2Pool(pool)) {
    const pair = new Pair(pool.reserve0.wrapped, pool.reserve1.wrapped)
    return pair.token0.equals(base.wrapped) ? pair.token0Price : pair.token1Price
  }
  return new Price(base, quote, JSBI.BigInt(1), JSBI.BigInt(0))
}
