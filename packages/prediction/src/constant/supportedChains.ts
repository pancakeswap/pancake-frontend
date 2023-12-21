import { ChainId } from '@pancakeswap/chains'

export const SUPPORTED_CHAIN_IDS = [ChainId.BSC, ChainId.ARBITRUM_ONE, ChainId.ZKSYNC] as const

export type SupportedChainId = (typeof SUPPORTED_CHAIN_IDS)[number]
