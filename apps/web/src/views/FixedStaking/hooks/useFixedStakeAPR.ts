import { Percent } from '@pancakeswap/sdk'
import { FixedStakingPool } from '../type'

export function useFixedStakeAPR(pool?: FixedStakingPool) {
  if (!pool)
    return {
      boostAPR: new Percent(0, 1000000000),
      lockDayPercent: new Percent(0, 1000000000),
    }

  const boostDayPercent = new Percent(pool.boostDayPercent, 1000000000)
  const lockDayPercent = new Percent(pool.lockDayPercent, 1000000000)

  const boostAPR = boostDayPercent.multiply(365)
  const lockAPR = lockDayPercent.multiply(365)

  return { boostAPR, lockAPR }
}
