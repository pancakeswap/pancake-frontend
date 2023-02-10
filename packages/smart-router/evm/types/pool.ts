import { Currency } from '@pancakeswap/sdk'

export interface BasePool {
  lpSymbol: string
  lpAddress: string
  token: Currency
  quoteToken: Currency
}

export interface StableSwapPool extends BasePool {
  stableSwapAddress: string
  infoStableSwapAddress: string
}
