import { Currency } from '@pancakeswap/sdk'
import { Address, Hex } from 'viem'

export interface BasePaymasterToken {
  address: Address
  symbol: string
  decimals: number

  chainId: number
  isNative: boolean
  isToken: boolean

  name?: string
  logoURI?: string
}

export type PaymasterToken = BasePaymasterToken & Partial<Currency & ZyfiResponse>

// Zyfi
export interface ZyfiResponse {
  txData: TxData
  gasLimit: string
  gasPrice: string
  tokenAddress: string
  tokenPrice: string
  feeTokenAmount: string
  feeTokendecimals: string
  feeUSD: string
  estimatedFinalFeeUSD: string
  estimatedFinalFeeTokenAmount: string
  markup: string
  expirationTime: string
  expiresIn: string
}

export interface TxData {
  chainId: number
  from: Address
  to: Address
  data: Hex
  value: Hex
  customData: CustomData
  maxFeePerGas: string
  gasLimit: number
}

export interface CustomData {
  paymasterParams: PaymasterParams
  gasPerPubdata: number
}

export interface PaymasterParams {
  paymaster: string
  paymasterInput: string
}
