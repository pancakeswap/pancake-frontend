import type { Pool } from '@pancakeswap/routing-sdk'

import { StablePool } from '../types'
import { STABLE_POOL_TYPE } from '../constants'

export function isStablePool(p: Pool): p is StablePool {
  return p.type === STABLE_POOL_TYPE
}
