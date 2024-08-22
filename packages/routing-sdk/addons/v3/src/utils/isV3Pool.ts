import type { Pool } from '@pancakeswap/routing-sdk'

import { V3Pool } from '../types'
import { V3_POOL_TYPE } from '../constants'

export function isV3Pool(p: Pool): p is V3Pool {
  return p.type === V3_POOL_TYPE
}
