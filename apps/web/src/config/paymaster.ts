import { zksyncTokens } from '@pancakeswap/tokens'

import { ChainId } from '@pancakeswap/chains'
import { Currency, Native } from '@pancakeswap/sdk'
import { Address, Hex } from 'viem'

export const DEFAULT_PAYMASTER_TOKEN = Native.onChain(ChainId.ZKSYNC)

export const paymasterTokens: Currency[] = [
  DEFAULT_PAYMASTER_TOKEN,
  zksyncTokens.wbtc,
  zksyncTokens.dai,
  zksyncTokens.usdc,
  zksyncTokens.usdcNative,
  zksyncTokens.usdt,
  zksyncTokens.grai,
  zksyncTokens.tes,
  zksyncTokens.busd,
  zksyncTokens.reth,
  zksyncTokens.wstETH,
  zksyncTokens.meow,
  zksyncTokens.weth,
  zksyncTokens.wethe,
  zksyncTokens.hold,
]

export const paymasterInfo: { [gasTokenAddress: Address]: { discount: `-${number}%` | 'FREE' } } = {
  [zksyncTokens.wbtc.address]: {
    discount: 'FREE', // Example: -20%, FREE
  },
  [zksyncTokens.dai.address]: {
    discount: 'FREE',
  },
  [zksyncTokens.usdc.address]: {
    discount: 'FREE',
  },
  [zksyncTokens.usdcNative.address]: {
    discount: 'FREE',
  },
  [zksyncTokens.usdt.address]: {
    discount: 'FREE',
  },
  [zksyncTokens.grai.address]: {
    discount: 'FREE',
  },
  [zksyncTokens.tes.address]: {
    discount: 'FREE',
  },
  [zksyncTokens.busd.address]: {
    discount: 'FREE',
  },
  [zksyncTokens.reth.address]: {
    discount: 'FREE',
  },
  [zksyncTokens.wstETH.address]: {
    discount: 'FREE',
  },
  [zksyncTokens.meow.address]: {
    discount: 'FREE',
  },
  [zksyncTokens.weth.address]: {
    discount: 'FREE',
  },
  [zksyncTokens.wethe.address]: {
    discount: 'FREE',
  },
  [zksyncTokens.hold.address]: {
    discount: 'FREE',
  },
}

// Zyfi
export const ZYFI_PAYMASTER_URL = 'https://api.zyfi.org/api/erc20_paymaster/v1'
export const ZYFI_SPONSORED_PAYMASTER_URL = 'https://api.zyfi.org/api/erc20_sponsored_paymaster/v1'

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
