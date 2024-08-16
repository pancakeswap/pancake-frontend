import { ChainId } from '@pancakeswap/chains'
import { parseCurrencyAmount, toSerializableCurrencyAmount } from '@pancakeswap/routing-sdk'

import { SerializableV2Pool, V2Pool, V2PoolData } from './types'
import { createV2Pool } from './createV2Pool'

export function toSerializableV2Pool(v2Pool: V2Pool): SerializableV2Pool {
  const pool = v2Pool.getPoolData()
  return {
    ...pool,
    reserve0: toSerializableCurrencyAmount(pool.reserve0),
    reserve1: toSerializableCurrencyAmount(pool.reserve1),
  }
}

export function parseV2Pool(chainId: ChainId, pool: SerializableV2Pool): V2Pool {
  const poolData: V2PoolData = {
    ...pool,
    reserve0: parseCurrencyAmount(chainId, pool.reserve0),
    reserve1: parseCurrencyAmount(chainId, pool.reserve1),
  }

  return createV2Pool(poolData)
}
