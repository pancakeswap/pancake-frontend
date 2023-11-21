import { ChainId } from '@pancakeswap/chains'

export const SUPPORTED_CHAIN_IDS = [ChainId.BSC, ChainId.ARBITRUM_ONE, ChainId.ZKSYNC, ChainId.ARBITRUM_GOERLI] as const // TODO: Remove ARBITRUM_GOERLI

export type SupportedChainId = (typeof SUPPORTED_CHAIN_IDS)[number]
