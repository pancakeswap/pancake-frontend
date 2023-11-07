import { MAX_VECAKE_LOCK_WEEKS } from 'config/constants/veCake'
import BN from 'bignumber.js'

export const getVeCakeAmount = (cakeToLocked: number | bigint | string, durationWeeks: number | string): number => {
  return new BN(String(cakeToLocked)).times(durationWeeks).div(MAX_VECAKE_LOCK_WEEKS).toNumber()
}
