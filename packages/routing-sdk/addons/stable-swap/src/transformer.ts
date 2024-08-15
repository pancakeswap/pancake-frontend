import { ChainId } from '@pancakeswap/chains'
import { Percent } from '@pancakeswap/swap-sdk-core'
import { parseCurrencyAmount, toSerializableCurrencyAmount } from '@pancakeswap/routing-sdk'

import { SerializableStablePool, StablePool, StablePoolData } from './types'
import { createStablePool } from './createStablePool'

const ONE_HUNDRED = 100n

export function toSerializableStablePool(stablePool: StablePool): SerializableStablePool {
  const pool = stablePool.getPoolData()
  return {
    ...pool,
    balances: pool.balances.map(toSerializableCurrencyAmount),
    amplifier: pool.amplifier.toString(),
    fee: pool.fee.toSignificant(6),
  }
}

export function parseStablePool(chainId: ChainId, pool: SerializableStablePool): StablePool {
  const poolData: StablePoolData = {
    ...pool,
    balances: pool.balances.map((b) => parseCurrencyAmount(chainId, b)),
    amplifier: BigInt(pool.amplifier),
    fee: new Percent(parseFloat(pool.fee) * 1000000, ONE_HUNDRED * 1000000n),
  }

  return createStablePool(poolData)
}
