import { NATIVE_CURRENCY_ADDRESS } from 'views/Swap/MMLinkPools/constants'
import { zksyncTokens } from '@pancakeswap/tokens'
import { Currency } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'
import { Address, Hex } from 'viem'

export const DEFAULT_PAYMASTER_TOKEN: PaymasterToken = {
  address: NATIVE_CURRENCY_ADDRESS,
  decimals: 18,
  name: 'Ether',
  symbol: 'ETH',
  logoURI: 'https://assets.pancakeswap.finance/web/native/324.png',
  isNative: true,
  isToken: false,
  chainId: ChainId.ZKSYNC,
}

export const paymasterTokens: PaymasterToken[] = [
  zksyncTokens.wbtc,
  zksyncTokens.dai,
  zksyncTokens.usdc,
  zksyncTokens.usdt,
  zksyncTokens.grai,
  zksyncTokens.tes,
]

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
