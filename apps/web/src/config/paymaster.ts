import { zksyncTokens } from '@pancakeswap/tokens'

import { ChainId } from '@pancakeswap/chains'
import { Currency, Native } from '@pancakeswap/sdk'
import { Address } from 'viem'

export const DEFAULT_PAYMASTER_TOKEN = Native.onChain(ChainId.ZKSYNC)

export const paymasterTokens = [
  DEFAULT_PAYMASTER_TOKEN.wrapped,
  zksyncTokens.wbtc,
  zksyncTokens.dai,
  zksyncTokens.usdc,
  zksyncTokens.usdcNative,
  zksyncTokens.usdt,
  zksyncTokens.grai,
  zksyncTokens.tes,
].map((token) => ({ ...token, discount: '-20%' }))

export interface BasePaymasterToken {
  address: Address
  discount?: string
}

// export type PaymasterToken = BasePaymasterToken & Partial<Currency | ERC20Token>

export type PaymasterToken = Currency & {
  discount?: string
}
