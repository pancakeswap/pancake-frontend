import BN from 'bignumber.js'
import { MAX_VECAKE_LOCK_WEEKS, WEEK } from 'config/constants/veCake'

export const getVeCakeAmount = (cakeToLocked: number | bigint | string, seconds: number | string): number => {
  return new BN(String(cakeToLocked || 0))
    .times(seconds || 0)
    .div((MAX_VECAKE_LOCK_WEEKS + 1) * WEEK - 1)
    .toNumber()
}
