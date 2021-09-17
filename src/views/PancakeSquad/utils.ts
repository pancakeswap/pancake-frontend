import { UserStatusEnum } from './types'

type getUserStatusType = {
  account?: string
  hasGen0: boolean | null
  hasActiveProfile: boolean
}

export const getUserStatus = ({ account, hasActiveProfile, hasGen0 }: getUserStatusType): UserStatusEnum => {
  if (account && hasActiveProfile && hasGen0) {
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
