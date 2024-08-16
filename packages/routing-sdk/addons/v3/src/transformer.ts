import { ChainId } from '@pancakeswap/chains'
import {
  parseCurrency,
  parseCurrencyAmount,
  toSerializableCurrency,
  toSerializableCurrencyAmount,
} from '@pancakeswap/routing-sdk'
import { Percent } from '@pancakeswap/swap-sdk-core'
import { Tick } from '@pancakeswap/v3-sdk'

import { SerializableTick, SerializableV3Pool, V3Pool, V3PoolData } from './types'
import { createV3Pool } from './createV3Pool'

const ONE_HUNDRED = 100n

export function toSerializableTick(tick: Tick): SerializableTick {
  return {
    index: tick.index,
    liquidityNet: String(tick.liquidityNet),
    liquidityGross: String(tick.liquidityGross),
  }
}

export function toSerializableV3Pool(v3Pool: V3Pool): SerializableV3Pool {
  const pool = v3Pool.getPoolData()
  return {
    ...pool,
    token0: toSerializableCurrency(pool.token0),
    token1: toSerializableCurrency(pool.token1),
    liquidity: pool.liquidity.toString(),
    sqrtRatioX96: pool.sqrtRatioX96.toString(),
    token0ProtocolFee: pool.token0ProtocolFee.toFixed(0),
    token1ProtocolFee: pool.token1ProtocolFee.toFixed(0),
    ticks: pool.ticks?.map(toSerializableTick),
    reserve0: pool.reserve0 && toSerializableCurrencyAmount(pool.reserve0),
    reserve1: pool.reserve1 && toSerializableCurrencyAmount(pool.reserve1),
  }
}

export function parseTick(tick: SerializableTick): Tick {
  return new Tick(tick)
}

export function parseV3Pool(chainId: ChainId, pool: SerializableV3Pool): V3Pool {
  const poolData: V3PoolData = {
    ...pool,
    token0: parseCurrency(chainId, pool.token0),
    token1: parseCurrency(chainId, pool.token1),
    liquidity: BigInt(pool.liquidity),
    sqrtRatioX96: BigInt(pool.sqrtRatioX96),
    token0ProtocolFee: new Percent(pool.token0ProtocolFee, ONE_HUNDRED),
    token1ProtocolFee: new Percent(pool.token1ProtocolFee, ONE_HUNDRED),
    ticks: pool.ticks?.map(parseTick),
    reserve0: pool.reserve0 && parseCurrencyAmount(chainId, pool.reserve0),
    reserve1: pool.reserve1 && parseCurrencyAmount(chainId, pool.reserve1),
  }

  return createV3Pool(poolData)
}
