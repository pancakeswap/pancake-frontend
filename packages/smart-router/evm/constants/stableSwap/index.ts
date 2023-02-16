import { ChainId } from '@pancakeswap/sdk'

import { StableSwapPool } from '../../types/pool'
import { STABLE_POOL_MAP } from './pools'

export function getStableSwapPools(chainId: ChainId): StableSwapPool[] {
  return STABLE_POOL_MAP[chainId] || []
}
