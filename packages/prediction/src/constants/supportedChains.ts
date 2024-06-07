import { ChainId } from '@pancakeswap/chains'
import { bsc, zkSync } from 'viem/chains'

// BSC_TESTNET is only for TESTING AI prediction market for Arbitrum
export const SUPPORTED_CHAIN_IDS = [ChainId.BSC, ChainId.ZKSYNC, ChainId.BSC_TESTNET] as const

export type SupportedChainId = (typeof SUPPORTED_CHAIN_IDS)[number]

export const targetChains = [bsc, zkSync]
