import { DeserializedCakeVault } from 'state/types'
import { isBefore, isAfter, addWeeks } from 'date-fns'

export const isStake = (pool: DeserializedCakeVault): boolean => pool.userData?.userShares.gt(0)
export const isLocked = (pool: DeserializedCakeVault): boolean => isStake(pool) && Boolean(pool.userData?.locked)

export const isLockedEnd = (pool: DeserializedCakeVault): boolean =>
  pool.userData?.lockEndTime &&
  isLocked(pool) &&
  isBefore(new Date(parseInt(pool.userData.lockEndTime) * 1000), new Date()) &&
  isAfter(new Date(parseInt(pool.userData.lockEndTime) * 1000), addWeeks(new Date(), 1))

export const isAfterBurning = (pool: DeserializedCakeVault): boolean =>
  pool.userData.lockEndTime &&
  isLocked(pool) &&
  isAfter(addWeeks(new Date(), 1), new Date(parseInt(pool.userData.lockEndTime) * 1000))
