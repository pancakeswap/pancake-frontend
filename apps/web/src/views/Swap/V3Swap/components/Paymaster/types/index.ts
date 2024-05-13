import { Address, Hex } from 'viem'

export interface PaymasterToken {
  address: Address
  decimals: number
  name: string
  symbol: string
  logoURI: string

  // Note: Zyfi API provides a markup amount after calling
  gasDiscount?: {
    value: (usdAmount: number) => number
    type: 'fixed' | 'percentage'
  }
}

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
