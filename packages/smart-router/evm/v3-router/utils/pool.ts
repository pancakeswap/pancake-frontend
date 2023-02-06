import { Pool, PoolType, StablePool, V2Pool, V3Pool } from '../types'

export function isV2Pool(pool: Pool): pool is V2Pool {
  return pool.type === PoolType.V2
}

export function isV3Pool(pool: Pool): pool is V3Pool {
  return pool.type === PoolType.V3
}

export function isStablePool(pool: Pool): pool is StablePool {
  return pool.type === PoolType.STABLE
}
