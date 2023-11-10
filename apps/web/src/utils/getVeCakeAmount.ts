import { MAX_VECAKE_LOCK_WEEKS } from 'config/constants/veCake'
import BN from 'bignumber.js'

export const getVeCakeAmount = (cakeToLocked: number | bigint | string, durationWeeks: number | string): number => {
  return new BN(String(cakeToLocked || 0))
    .times(durationWeeks || 0)
    .div(MAX_VECAKE_LOCK_WEEKS)
    .toNumber()
}
