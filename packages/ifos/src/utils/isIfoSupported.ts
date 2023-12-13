import { ChainId } from '@pancakeswap/sdk'

import {
  PROFILE_SUPPORTED_CHAIN_IDS,
  ProfileSupportedChainId,
  SUPPORTED_CHAIN_IDS,
  SupportedChainId,
} from '../constants/supportedChains'

export function isIfoSupported(chainId?: ChainId): chainId is SupportedChainId {
  return !!chainId && (SUPPORTED_CHAIN_IDS as readonly ChainId[]).includes(chainId)
}

export function isNativeIfoSupported(chainId?: ChainId): chainId is ProfileSupportedChainId {
  return !!chainId && (PROFILE_SUPPORTED_CHAIN_IDS as readonly ChainId[]).includes(chainId)
}

export function isCrossChainIfoSupportedOnly(chainId?: ChainId) {
  return isIfoSupported(chainId) && !isNativeIfoSupported(chainId)
}
