import { Token } from '@pancakeswap/swap-sdk-core'
import { ReactNode } from 'react'
import { Abi, Address } from 'viem'

export interface NativeToken {
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

export interface FAQType {
  id: number
  title: ReactNode
  description: ReactNode
}

export interface LiquidStakingList {
  stakingSymbol: string
  contract: Address
  token0: Token | NativeToken
  token1: Token | NativeToken
  aprUrl: string
  abi: Abi
  approveToken: Token | null
  shouldCheckApproval: boolean
  exchangeRateMultiCall: ExchangeRateMultiCall[]
  stakingMethodArgs: string[]
  stakingOverrides: string[]
  FAQs: FAQType[]
  requestWithdrawFn: string
}
