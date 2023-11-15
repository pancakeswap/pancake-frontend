import {
  BoostedPoolsSupportedChainId,
  BOOSTED_POOLS_SUPPORTED_CHAIN_IDS,
} from '../../constants/boostedPoolsSupportedChains'

export function isBoostedPoolsSupported(chainId: number): chainId is BoostedPoolsSupportedChainId {
  return BOOSTED_POOLS_SUPPORTED_CHAIN_IDS.includes(chainId)
}
