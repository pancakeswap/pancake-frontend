import { Token } from '@pancakeswap/swap-sdk-core'

interface NativeToken {
  name: string
  symbol: string
  decimals: number
  address?: string
}

export enum FunctionName {
  exchangeRate = 'exchangeRate',
  convertSnBnbToBnb = 'convertSnBnbToBnb',
}

export interface LiquidStakingList {
  stakingSymbol: string
  contract: string
  symbol: string
  token0: Token | NativeToken
  token1: Token | NativeToken
  aprUrl: string
  multiCallMethods?: any
}
