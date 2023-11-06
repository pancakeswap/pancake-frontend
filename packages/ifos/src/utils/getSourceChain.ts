import { ChainId } from '@pancakeswap/chains'

import { isIfoSupported, isNativeIfoSupported } from './isIfoSupported'
import { SOURCE_CHAIN_MAP } from '../constants'

export function getSourceChain(chainId?: ChainId): ChainId | undefined {
  if (!isIfoSupported(chainId)) {
    return undefined
  }

  // The provided chain is the source chain if it supports native ifo
  if (isNativeIfoSupported(chainId)) {
    return chainId
  }

  return SOURCE_CHAIN_MAP[chainId]
}
