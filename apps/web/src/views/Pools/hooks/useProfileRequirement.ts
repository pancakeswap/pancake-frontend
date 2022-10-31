import { useProfile } from 'state/profile/hooks'
import { Pool } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { Token } from '@pancakeswap/sdk'

export function useProfileRequirement(profileRequirement: Pool.DeserializedPool<Token>['profileRequirement']) {
  const { profile, hasActiveProfile } = useProfile()

  const notMeetRequired = useMemo(
    () => profileRequirement && profileRequirement.required && !hasActiveProfile,
    [profileRequirement, hasActiveProfile],
  )
  const notMeetThreshold = useMemo(
    () =>
      profileRequirement &&
      profileRequirement.thresholdPoints.gt(0) &&
      profileRequirement.thresholdPoints.gt(profile?.points ?? 0),
    [profileRequirement, profile],
  )

  return {
    notMeetRequired,
    notMeetThreshold,
  }
}
