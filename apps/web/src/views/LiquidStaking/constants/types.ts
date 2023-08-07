import { Abi, Address } from 'viem'
import { Token } from '@pancakeswap/swap-sdk-core'

interface NativeToken {
  name: string
  symbol: string
  decimals: number
  address?: string
}

interface ExchangeRateMultiCall {
  abi: Abi
  address: Address
  functionName: FunctionName
  args?: any
}

export enum FunctionName {
  exchangeRate = 'exchangeRate',
  convertSnBnbToBnb = 'convertSnBnbToBnb',
}

export interface LiquidStakingList {
  stakingSymbol: string
  contract: Address
  token0: Token | NativeToken
  token1: Token | NativeToken
  aprUrl: string
  abi: Abi
  approveToken: Token
  shouldCheckApproval: boolean
  exchangeRateMultiCall: ExchangeRateMultiCall[]
}
