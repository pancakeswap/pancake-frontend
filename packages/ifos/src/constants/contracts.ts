import { ChainId } from '@pancakeswap/sdk'
import { Address } from 'viem'

import { SupportedChainId } from './supportedChains'

export type ContractAddresses<T extends ChainId = SupportedChainId> = {
  [chainId in T]: Address
}

export const ICAKE = {
  [ChainId.BSC]: '0x3C458828D1622F5f4d526eb0d24Da8C4Eb8F07b1',
  [ChainId.POLYGON_ZKEVM]: '0x7edCae5132FC817a7ee1a992691497bf4e720097',
} as const satisfies ContractAddresses<SupportedChainId>
