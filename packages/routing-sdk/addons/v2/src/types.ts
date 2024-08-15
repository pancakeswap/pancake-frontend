import { Currency, CurrencyAmount } from '@pancakeswap/swap-sdk-core'
import type { SerializableCurrencyAmount, Pool } from '@pancakeswap/routing-sdk'

import { V2_POOL_TYPE } from './constants/poolType'

export type Address = `0x${string}`

export type V2PoolType = typeof V2_POOL_TYPE

export type V2PoolData = {
  reserve0: CurrencyAmount<Currency>
  reserve1: CurrencyAmount<Currency>
}

export type V2Pool = Pool<V2PoolType, V2PoolData>

export type SerializableV2Pool = {
  reserve0: SerializableCurrencyAmount
  reserve1: SerializableCurrencyAmount
}
