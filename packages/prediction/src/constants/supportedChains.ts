import { ChainId } from '@pancakeswap/chains'
import { bsc, zkSync } from 'wagmi/chains'

export const SUPPORTED_CHAIN_IDS = [ChainId.BSC, ChainId.ZKSYNC] as const

export type SupportedChainId = (typeof SUPPORTED_CHAIN_IDS)[number]

export const targetChains = [bsc, zkSync]
