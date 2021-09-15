import { UserStatusEnum } from './types'

type getUserStatusType = {
  account?: string
  canClaimForGen0: boolean | null
  hasActiveProfile: boolean
}

export const getUserStatus = ({ account, hasActiveProfile, canClaimForGen0 }: getUserStatusType): UserStatusEnum => {
  if (account && hasActiveProfile && canClaimForGen0) {
    return UserStatusEnum.PROFILE_ACTIVE_GEN0
  }
  if (account && hasActiveProfile) {
    return UserStatusEnum.PROFILE_ACTIVE
  }
  if (account) {
    return UserStatusEnum.NO_PROFILE
  }
  return UserStatusEnum.UNCONNECTED
}
