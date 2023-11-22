import { UNLOCK_FREE_DURATION } from '@pancakeswap/pools'
import BigNumber from 'bignumber.js'

export const isStaked = ({ userShares }: { userShares?: BigNumber }): boolean => Boolean(userShares && userShares.gt(0))

export const isLocked = ({ userShares, locked }: { userShares?: BigNumber; locked?: boolean }): boolean =>
  isStaked({ userShares }) && Boolean(locked) // && !isAfter(new Date(lockEndTime * 1000), new Date())

export const isLockedEnd = ({ userShares, locked, lockEndTime }: VaultPositionParams): boolean =>
  !!lockEndTime &&
  lockEndTime !== '0' &&
  isLocked({ userShares, locked }) &&
  Date.now() >= parseInt(lockEndTime) * 1000 &&
  Date.now() <= new Date(parseInt(lockEndTime) * 1000).getTime() + UNLOCK_FREE_DURATION * 1000

export const isAfterBurning = ({ userShares, locked, lockEndTime }: VaultPositionParams): boolean =>
  !!lockEndTime &&
  lockEndTime !== '0' &&
  isLocked({ userShares, locked }) &&
  Date.now() > new Date(parseInt(lockEndTime) * 1000).getTime() + UNLOCK_FREE_DURATION * 1000

export enum VaultPosition {
  None,
  Flexible,
  Locked,
  LockedEnd,
  AfterBurning,
}

export type VaultPositionParams = { userShares?: BigNumber; locked?: boolean; lockEndTime?: string }

export const getVaultPosition = (params: VaultPositionParams | undefined): VaultPosition => {
  if (!params) return VaultPosition.None

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
  return VaultPosition.None
}
