import { ChainId } from '@pancakeswap/chains'
import { arbitrum, bsc, zkSync } from 'wagmi/chains'

export const SUPPORTED_CHAIN_IDS = [ChainId.BSC, ChainId.ARBITRUM_ONE, ChainId.ZKSYNC] as const

export type SupportedChainId = (typeof SUPPORTED_CHAIN_IDS)[number]

export const targetChains = [bsc, zkSync, arbitrum]
