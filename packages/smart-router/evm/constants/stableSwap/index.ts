import { ChainId } from '@pancakeswap/sdk'

import { poolMap } from './pools'
import { StableSwapPool } from './types'

export function getStableSwapPools(chainId: ChainId): StableSwapPool[] {
  return poolMap[chainId] || []
}
