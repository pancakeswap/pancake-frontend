import { ChainId } from '@pancakeswap/chains'

// Chains that only support cross chain ifo
export const CROSS_CHAIN_ONLY_SUPPORTED_CHAIN_IDS = [
  // ChainId.POLYGON_ZKEVM,
  ChainId.GOERLI,
  ChainId.ARBITRUM_ONE,
] as const

// Chains that support native ifo. Shouldn't overlap with cross chain only chains
export const PROFILE_SUPPORTED_CHAIN_IDS = [ChainId.BSC, ChainId.BSC_TESTNET] as const

// CROSS_CHAIN_ONLY_SUPPORTED_CHAIN_IDS + PROFILE_SUPPORTED_CHAIN_IDS = SUPPORTED_CHAIN_IDS
export const SUPPORTED_CHAIN_IDS = [...PROFILE_SUPPORTED_CHAIN_IDS, ...CROSS_CHAIN_ONLY_SUPPORTED_CHAIN_IDS] as const

export type SupportedChainId = (typeof SUPPORTED_CHAIN_IDS)[number]

export type ProfileSupportedChainId = (typeof PROFILE_SUPPORTED_CHAIN_IDS)[number]

export type CrossChainOnlySupportedChainId = (typeof CROSS_CHAIN_ONLY_SUPPORTED_CHAIN_IDS)[number]

// A mapping of destination chain to the source chain
export const SOURCE_CHAIN_MAP: Record<CrossChainOnlySupportedChainId, ProfileSupportedChainId> = {
  // [ChainId.POLYGON_ZKEVM]: ChainId.BSC,
  [ChainId.GOERLI]: ChainId.BSC_TESTNET,
  [ChainId.ARBITRUM_ONE]: ChainId.BSC,
}

export const SOURCE_CHAIN_TO_DEST_CHAINS = Object.keys(SOURCE_CHAIN_MAP).reduce((map, destChain) => {
  const destChainId: CrossChainOnlySupportedChainId = Number(destChain)
  const srcChain = SOURCE_CHAIN_MAP[destChainId]
  if (!map[srcChain]) {
    return {
      ...map,
      [srcChain]: [destChainId],
    }
  }
  return {
    ...map,
    [srcChain]: [...map[srcChain], destChainId],
  }
}, {} as Record<ProfileSupportedChainId, CrossChainOnlySupportedChainId[]>)
