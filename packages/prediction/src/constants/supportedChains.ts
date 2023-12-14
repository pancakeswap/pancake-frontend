import { ChainId } from '@pancakeswap/chains'
import { arbitrum, arbitrumGoerli, bsc, zkSync } from 'wagmi/chains'

export const SUPPORTED_CHAIN_IDS = [ChainId.BSC, ChainId.ARBITRUM_ONE, ChainId.ZKSYNC, ChainId.ARBITRUM_GOERLI] as const // TODO: Remove ARBITRUM_GOERLI

export type SupportedChainId = (typeof SUPPORTED_CHAIN_IDS)[number]

export const targetChains = [bsc, zkSync, arbitrum, arbitrumGoerli] // TODO: Remove ARBITRUM_GOERLI
