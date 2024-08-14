import { Currency, CurrencyAmount, Percent } from '@pancakeswap/swap-sdk-core'
import { Tick } from '@pancakeswap/v3-sdk'
import type { SerializableCurrency, SerializableCurrencyAmount, Pool } from '@pancakeswap/routing-sdk'

import { V3_POOL_TYPE } from './constants/poolType'

export type Address = `0x${string}`

export type V3PoolType = typeof V3_POOL_TYPE

export type V3PoolData = {
  token0: Currency
  token1: Currency
  // Different fee tier
  fee: number
  tickSpacing?: number
  liquidity: bigint
  sqrtRatioX96: bigint
  tick: number
  address: Address
  token0ProtocolFee: Percent
  token1ProtocolFee: Percent

  // Allow pool with no ticks data provided
  ticks?: Tick[]

  reserve0?: CurrencyAmount<Currency>
  reserve1?: CurrencyAmount<Currency>
}

export type V3Pool = Pool<V3PoolType, V3PoolData>

export type SerializableV3Pool = {
  token0: SerializableCurrency
  token1: SerializableCurrency
  fee: number
  tickSpacing?: number
  liquidity: string
  sqrtRatioX96: string
  tick: number
  address: Address
  token0ProtocolFee: string
  token1ProtocolFee: string

  ticks?: SerializableTick[]

  reserve0?: SerializableCurrencyAmount
  reserve1?: SerializableCurrencyAmount
}

export type SerializableTick = {
  index: number
  liquidityGross: string
  liquidityNet: string
}
