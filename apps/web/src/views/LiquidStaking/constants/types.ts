import { Token } from '@pancakeswap/swap-sdk-core'

interface NativeToken {
  name: string
  symbol: string
  decimals: number
}

export interface LiquidStakingList {
  stakingSymbol: string
  contract: string
  symbol: string
  token0: Token | NativeToken
  token1: Token
}
