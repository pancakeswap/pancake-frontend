import { ChainId } from '@pancakeswap/chains'

export default {
  pancakeProfile: {
    [ChainId.BSC]: '0xDf4dBf6536201370F95e06A0F8a7a70fE40E388a',
    [ChainId.BSC_TESTNET]: '0x4B683C7E13B6d5D7fd1FeA9530F451954c1A7c8A',
  },
} as const satisfies Record<string, Record<number, `0x${string}`>>
