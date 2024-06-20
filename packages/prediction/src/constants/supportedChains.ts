import { ChainId } from '@pancakeswap/chains'
import { arbitrum, bsc, zkSync } from 'viem/chains'

export const SUPPORTED_CHAIN_IDS = [ChainId.BSC, ChainId.ZKSYNC, ChainId.ARBITRUM_ONE] as const

export type SupportedChainId = (typeof SUPPORTED_CHAIN_IDS)[number]

export const targetChains = [bsc, zkSync, arbitrum]
