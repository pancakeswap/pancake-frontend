import { zkSync } from 'viem/zksync'
import { NATIVE_CURRENCY_ADDRESS } from 'views/Swap/MMLinkPools/constants'
import { zksyncTokens } from '@pancakeswap/tokens'
import { PaymasterToken } from '../types'

export const DEFAULT_PAYMASTER_TOKEN: PaymasterToken = {
  address: NATIVE_CURRENCY_ADDRESS,
  decimals: 18,
  name: 'Ether',
  symbol: 'ETH',
  logoURI: 'https://assets.pancakeswap.finance/web/native/324.png',
  isNative: true,
  isToken: false,
  chainId: zkSync.id,
}

export const paymasterTokens: PaymasterToken[] = [
  { ...zksyncTokens.wbtc, logoURI: 'https://tokens.pancakeswap.finance/images/symbol/wbtc.png' },
  { ...zksyncTokens.dai, logoURI: 'https://tokens.pancakeswap.finance/images/symbol/dai.png' },
  { ...zksyncTokens.usdc, logoURI: 'https://tokens.pancakeswap.finance/images/symbol/usdc.png' },
  {
    ...zksyncTokens.usdt,
    logoURI: `https://tokens.pancakeswap.finance/images/symbol/usdt.png`,
  },
  {
    ...zksyncTokens.grai,
    logoURI: `https://tokens.pancakeswap.finance/images/zksync/${zksyncTokens.grai.address}.png`,
  },
  { ...zksyncTokens.tes, logoURI: `https://tokens.pancakeswap.finance/images/zksync/${zksyncTokens.tes.address}.png` },
]
