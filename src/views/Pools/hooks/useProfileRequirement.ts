import { useProfile } from 'state/profile/hooks'
import { DeserializedPool } from 'state/types'
import { useMemo } from 'react'

export function useProfileRequirement(profileRequirement: DeserializedPool['profileRequirement']) {
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
