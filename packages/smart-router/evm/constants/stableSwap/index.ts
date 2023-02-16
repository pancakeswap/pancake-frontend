import { ChainId } from '@pancakeswap/sdk'

import { StableSwapPool } from '../../types/pool'
import { isStableSwapSupported, STABLE_POOL_MAP } from './pools'

export function getStableSwapPools(chainId: ChainId): StableSwapPool[] {
  // Stable swap is only supported on BSC chain & BSC testnet
  if (!isStableSwapSupported(chainId)) {
    return []
  }
  return STABLE_POOL_MAP[chainId] || []
}
