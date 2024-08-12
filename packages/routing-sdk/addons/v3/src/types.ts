import { Currency, CurrencyAmount } from '@pancakeswap/swap-sdk-core'
import { Tick } from '@pancakeswap/v3-sdk'

import { V3_POOL_TYPE } from './constants/poolType'

export type Address = `0x${string}`

export type V3PoolData = {
  token0: Currency
  token1: Currency
  // Different fee tier
  fee: number
  tickSpacing: number
  liquidity: bigint
  sqrtRatioX96: bigint
  tick: number
  address: Address

  // Allow pool with no ticks data provided
  ticks: Tick[]

  reserve0: CurrencyAmount<Currency>
  reserve1: CurrencyAmount<Currency>
}

export type V3PoolType = typeof V3_POOL_TYPE
