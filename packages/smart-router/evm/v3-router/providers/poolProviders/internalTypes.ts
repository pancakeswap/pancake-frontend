import { Currency } from '@pancakeswap/sdk'
import { FeeAmount } from '@pancakeswap/v3-sdk'

// Information used to identify a pool
export interface PoolMeta {
  currencyA: Currency
  currencyB: Currency
  id: `0x${string}`
}

export interface V3PoolMeta extends PoolMeta {
  fee: FeeAmount
}
