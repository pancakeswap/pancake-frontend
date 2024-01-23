import { EXPERIMENTAL_FEATURES } from 'config/experimentalFeatures'
import { useExperimentalFeatureEnabled } from 'hooks/useExperimentalFeatureEnabled'
import { useAllowNotifications } from 'state/notifications/hooks'

export const useWebNotifications = () => {
  const [allowNotifications] = useAllowNotifications()
  const featureEnabled = useExperimentalFeatureEnabled(EXPERIMENTAL_FEATURES.WebNotifications)
  const enabled = Boolean(allowNotifications ?? featureEnabled)

  return { enabled }
}
