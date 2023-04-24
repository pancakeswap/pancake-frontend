import { SupportedChainId, SUPPORTED_CHAIN_IDS } from '../constants/supportedChains'

export function isPoolsSupported(chainId: number): chainId is SupportedChainId {
  return SUPPORTED_CHAIN_IDS.includes(chainId)
}
