import { Currency, CurrencyAmount, Percent } from '@pancakeswap/sdk'
import { FeeAmount, Tick } from '@pancakeswap/v3-sdk'

export enum PoolType {
  V2,
  V3,
  STABLE,
}

export interface BasePool {
  type: PoolType
}

export interface V2Pool extends BasePool {
  type: PoolType.V2
  reserve0: CurrencyAmount<Currency>
  reserve1: CurrencyAmount<Currency>
}

export interface StablePool extends BasePool {
  address: string
  type: PoolType.STABLE
  // Could be 2 token pool or more
  balances: CurrencyAmount<Currency>[]
  amplifier: bigint
  // Swap fee
  fee: Percent
}

export interface V3Pool extends BasePool {
  type: PoolType.V3
  token0: Currency
  token1: Currency
  // Different fee tier
  fee: FeeAmount
  liquidity: bigint
  sqrtRatioX96: bigint
  tick: number
  address: string
  token0ProtocolFee: Percent
  token1ProtocolFee: Percent

  // Allow pool with no ticks data provided
  ticks?: Tick[]
}

export type Pool = V2Pool | V3Pool | StablePool
