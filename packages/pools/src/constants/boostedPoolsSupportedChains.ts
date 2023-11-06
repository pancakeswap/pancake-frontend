import { ChainId } from '@pancakeswap/chains'

export const BOOSTED_POOLS_SUPPORTED_CHAIN_IDS = [ChainId.ARBITRUM_ONE] as const

export type BoostedPoolsSupportedChainId = (typeof BOOSTED_POOLS_SUPPORTED_CHAIN_IDS)[number]
