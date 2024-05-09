import { ChainId } from '@pancakeswap/sdk'

import { SupportedChainId } from './supportedChains'

export const CROSS_CHAIN_GAS_MULTIPLIER = {
  [ChainId.BSC]: 1,
  // [ChainId.POLYGON_ZKEVM]: 1.5,
  [ChainId.ARBITRUM_ONE]: 1.5,
  [ChainId.BSC_TESTNET]: 1.5,
  [ChainId.GOERLI]: 1.5,
} as const satisfies Record<SupportedChainId, number>
