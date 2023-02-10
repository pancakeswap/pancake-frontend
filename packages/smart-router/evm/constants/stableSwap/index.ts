import { StableSwapPool } from '../../types/pool'
import { StableSupportedChainId, STABLE_POOL_MAP } from './pools'

export function getStableSwapPools(chainId: StableSupportedChainId): StableSwapPool[] {
  return STABLE_POOL_MAP[chainId] || []
}
