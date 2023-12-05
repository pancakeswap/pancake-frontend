import { Pool } from '../entities/pool'

export const isPoolTickInRange = (
  pool: Pool | undefined | null,
  tickLower: number | undefined,
  tickUpper: number | undefined
) => {
  if (!pool) return false
  const below = typeof tickLower === 'number' ? pool.tickCurrent < tickLower : undefined
  const above = typeof tickUpper === 'number' ? pool.tickCurrent >= tickUpper : undefined
  return typeof below === 'boolean' && typeof above === 'boolean' ? !below && !above : false
}
