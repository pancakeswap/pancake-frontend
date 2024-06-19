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
  zksyncTokens.zk,
]

export const paymasterInfo: {
  [gasTokenAddress: Address]: { discount: `-${number}%` | 'FREE'; discountLabel?: string }
} = {
  [zksyncTokens.wbtc.address]: {
    discount: '-20%', // Example: -20%, FREE
  },
  [zksyncTokens.dai.address]: {
    discount: '-20%',
  },
  [zksyncTokens.usdc.address]: {
    discount: '-20%',
  },
  [zksyncTokens.usdcNative.address]: {
    discount: '-20%',
  },
  [zksyncTokens.usdt.address]: {
    discount: '-20%',
  },
  [zksyncTokens.grai.address]: {
    discount: '-20%',
  },
  [zksyncTokens.tes.address]: {
    discount: '-20%',
  },
  [zksyncTokens.busd.address]: {
    discount: '-20%',
  },
  [zksyncTokens.reth.address]: {
    discount: '-20%',
  },
  [zksyncTokens.wstETH.address]: {
    discount: '-20%',
  },
  [zksyncTokens.meow.address]: {
    discount: '-20%',
  },
  [zksyncTokens.weth.address]: {
    discount: '-20%',
  },
  [zksyncTokens.wethe.address]: {
    discount: '-20%',
  },
  [zksyncTokens.hold.address]: {
    discount: '-20%',
  },
  [zksyncTokens.zk.address]: {
    discount: '-20%',
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
