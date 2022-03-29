import BigNumber from 'bignumber.js'
import { addWeeks, isAfter, isBefore } from 'date-fns'

export const isStaked = ({ userShares }: { userShares?: BigNumber }): boolean => userShares && userShares.gt(0)

export const isLocked = ({ userShares, locked }: { userShares?: BigNumber; locked?: boolean }): boolean =>
  isStaked({ userShares }) && Boolean(locked)

export const isLockedEnd = ({
  userShares,
  locked,
  lockEndTime,
}: {
  userShares?: BigNumber
  locked?: boolean
  lockEndTime?: string
}): boolean =>
  lockEndTime &&
  isLocked({ userShares, locked }) &&
  isBefore(new Date(parseInt(lockEndTime) * 1000), new Date()) &&
  isAfter(new Date(parseInt(lockEndTime) * 1000), addWeeks(new Date(), 1))

export const isAfterBurning = ({
  userShares,
  locked,
  lockEndTime,
}: {
  userShares?: BigNumber
  locked?: boolean
  lockEndTime?: string
}): boolean =>
  lockEndTime &&
  isLocked({ userShares, locked }) &&
  isAfter(addWeeks(new Date(), 1), new Date(parseInt(lockEndTime) * 1000))
