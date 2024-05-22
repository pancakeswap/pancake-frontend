import { zksyncTokens } from '@pancakeswap/tokens'

import { ChainId } from '@pancakeswap/chains'
import { Native, Currency, ERC20Token } from '@pancakeswap/sdk'
import { Address } from 'viem'

export const DEFAULT_PAYMASTER_TOKEN: PaymasterToken = {
  ...Native.onChain(ChainId.ZKSYNC),
  address: '0x0', // Only for compatibility
}

export const paymasterTokens: PaymasterToken[] = [
  zksyncTokens.wbtc,
  zksyncTokens.dai,
  zksyncTokens.usdc,
  zksyncTokens.usdt,
  zksyncTokens.grai,
  zksyncTokens.tes,
].map((token) => ({ ...token, discount: '-20%' }))

export interface BasePaymasterToken {
  address: Address
  discount?: string
}

export type PaymasterToken = BasePaymasterToken & Partial<Currency | ERC20Token>
