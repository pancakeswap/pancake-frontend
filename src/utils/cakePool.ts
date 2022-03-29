import BigNumber from 'bignumber.js'
import { addWeeks, isAfter, isBefore } from 'date-fns'

export const isStaked = ({ userShares }: { userShares?: BigNumber }): boolean => userShares && userShares.gt(0)

export const isLocked = ({ userShares, locked }: { userShares?: BigNumber; locked?: boolean }): boolean =>
  isStaked({ userShares }) && Boolean(locked)

export const isLockedEnd = ({ userShares, locked, lockEndTime }: VaultPositionParams): boolean =>
  lockEndTime &&
  isLocked({ userShares, locked }) &&
  isBefore(new Date(parseInt(lockEndTime) * 1000), new Date()) &&
  isAfter(new Date(parseInt(lockEndTime) * 1000), addWeeks(new Date(), 1))

export const isAfterBurning = ({ userShares, locked, lockEndTime }: VaultPositionParams): boolean =>
  lockEndTime &&
  isLocked({ userShares, locked }) &&
  isAfter(addWeeks(new Date(), 1), new Date(parseInt(lockEndTime) * 1000))

export enum VaultPosition {
  Flexible,
  Locked,
  LockedEnd,
  AfterBurning,
}

export type VaultPositionParams = { userShares?: BigNumber; locked?: boolean; lockEndTime?: string }

export const getVaultPosition = (params: VaultPositionParams): VaultPosition => {
  if (isAfterBurning(params)) {
    return VaultPosition.AfterBurning
  }
  if (isLockedEnd(params)) {
    return VaultPosition.LockedEnd
  }
  if (isLocked(params)) {
    return VaultPosition.Locked
  }
  if (isStaked(params)) {
    return VaultPosition.Flexible
  }
  return -1
}
