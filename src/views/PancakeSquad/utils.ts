import { UserStatusEnum } from './types'

type getUserStatusType = {
  account?: string
  canClaimGen0: boolean | null
  hasProfile: boolean
}

export const getUserStatus = ({ account, hasProfile, canClaimGen0 }: getUserStatusType): UserStatusEnum => {
  if (account && hasProfile && canClaimGen0) {
    return UserStatusEnum.PROFILE_ACTIVE_GEN0
  }
  if (account && hasProfile) {
    return UserStatusEnum.PROFILE_ACTIVE
  }
  if (account) {
    return UserStatusEnum.NO_PROFILE
  }
  return UserStatusEnum.UNCONNECTED
}
