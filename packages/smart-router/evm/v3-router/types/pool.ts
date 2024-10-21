import { Currency, CurrencyAmount, Percent } from '@pancakeswap/sdk'
import { FeeAmount, Tick } from '@pancakeswap/v3-sdk'
import { Address } from 'viem'

export enum PoolType {
  V2,
  V3,
  STABLE,
  V4CL,
  V4BIN,
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
  address: Address
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
  address: Address
  token0ProtocolFee: Percent
  token1ProtocolFee: Percent

  // Allow pool with no ticks data provided
  ticks?: Tick[]

  reserve0?: CurrencyAmount<Currency>
  reserve1?: CurrencyAmount<Currency>
}

export type V4ClPool = BasePool & {
  id: `0x${string}`
  type: PoolType.V4CL
  currency0: Currency
  currency1: Currency
  fee: number
  tickSpacing: number
  liquidity: bigint
  sqrtRatioX96: bigint
  tick: number
  hooks?: Address
  poolManager: Address

  // Allow pool with no ticks data provided
  ticks?: Tick[]

  reserve0?: CurrencyAmount<Currency>
  reserve1?: CurrencyAmount<Currency>
}

type ActiveId = number
type Reserve = {
  reserveX: bigint
  reserveY: bigint
}
export type V4BinPool = BasePool & {
  id: `0x${string}`
  type: PoolType.V4BIN
  currency0: Currency
  currency1: Currency
  fee: number
  binStep: bigint
  activeId: ActiveId

  hooks?: Address
  poolManager: Address
  reserveOfBin?: Record<ActiveId, Reserve>

  reserve0?: CurrencyAmount<Currency>
  reserve1?: CurrencyAmount<Currency>
}

export type Pool = V2Pool | V3Pool | StablePool | V4BinPool | V4ClPool

export interface WithTvl {
  tvlUSD: bigint
}

export type V3PoolWithTvl = V3Pool & WithTvl

export type V2PoolWithTvl = V2Pool & WithTvl

export type StablePoolWithTvl = StablePool & WithTvl
