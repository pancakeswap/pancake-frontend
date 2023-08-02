import { ChainId } from '@pancakeswap/sdk'

// Chains that only support cross chain ifo
export const CROSS_CHAIN_ONLY_SUPPORTED_CHAIN_IDS = [] as const

// Chains that support native ifo. Shouldn't overlap with cross chain only chains
export const PROFILE_SUPPORTED_CHAIN_IDS = [ChainId.BSC] as const

// CROSS_CHAIN_ONLY_SUPPORTED_CHAIN_IDS + PROFILE_SUPPORTED_CHAIN_IDS = SUPPORTED_CHAIN_IDS
export const SUPPORTED_CHAIN_IDS = [...PROFILE_SUPPORTED_CHAIN_IDS, ...CROSS_CHAIN_ONLY_SUPPORTED_CHAIN_IDS] as const

export type SupportedChainId = (typeof SUPPORTED_CHAIN_IDS)[number]

export type ProfileSupportedChainId = (typeof PROFILE_SUPPORTED_CHAIN_IDS)[number]

export type CrossChainOnlySupportedChainId = (typeof CROSS_CHAIN_ONLY_SUPPORTED_CHAIN_IDS)[number]
