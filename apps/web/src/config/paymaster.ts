import { zksyncTokens } from '@pancakeswap/tokens'

import { ChainId } from '@pancakeswap/chains'
import { Currency, Native } from '@pancakeswap/sdk'

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
]

export const paymasterInfo = {
  [zksyncTokens.wbtc.address]: {
    discount: '-20%',
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
}
