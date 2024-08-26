import type { SerializedWrappedToken } from '@pancakeswap/token-lists'

type Address = `0x${string}`

export interface BasePool {
  lpSymbol: string
  lpAddress: Address
  token: SerializedWrappedToken
  quoteToken: SerializedWrappedToken
}

export interface StableSwapPool extends BasePool {
  stableSwapAddress: Address
  infoStableSwapAddress: Address
  stableTotalFee: number
  stableLpFee: number
  stableLpFeeRateOfTotalFee: number
}
