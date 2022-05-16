import { useProfile } from 'state/profile/hooks'
import { DeserializedPool } from 'state/types'

export function useProfileRequirement(profileRequirement: DeserializedPool['profileRequirement']) {
  const { profile, hasProfile } = useProfile()

  const notMeetRequired = profileRequirement && profileRequirement.required && (!hasProfile || !profile.isActive)
  const notMeetThreshold =
    profileRequirement &&
    profileRequirement.thresholdPoints.gt(0) &&
    profileRequirement.thresholdPoints.gt(profile?.points ?? 0)

  return {
    notMeetRequired,
    notMeetThreshold,
  }
}
