import { ChainId } from '@pancakeswap/chains'

import { CrossChainOnlySupportedChainId, SOURCE_CHAIN_TO_DEST_CHAINS } from '../constants'
import { isNativeIfoSupported } from './isIfoSupported'

export function getDestChains(chainId?: ChainId): CrossChainOnlySupportedChainId[] | undefined {
  if (!isNativeIfoSupported(chainId)) {
    return undefined
  }
  return SOURCE_CHAIN_TO_DEST_CHAINS[chainId]
}
