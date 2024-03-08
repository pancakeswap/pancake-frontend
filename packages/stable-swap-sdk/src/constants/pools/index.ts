import { ChainId } from '@pancakeswap/chains'

import { isStableSwapSupported, STABLE_POOL_MAP, STABLE_SUPPORTED_CHAIN_IDS } from './pools'
import { StableSwapPool } from '../../types'

export function getStableSwapPools(chainId: ChainId): StableSwapPool[] {
  // Stable swap is only supported on BSC chain & BSC testnet
  if (!isStableSwapSupported(chainId)) {
    return []
  }
  return STABLE_POOL_MAP[chainId] || []
}

export { isStableSwapSupported, STABLE_SUPPORTED_CHAIN_IDS }
