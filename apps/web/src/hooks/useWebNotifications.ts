import { useAllowNotifications } from 'state/notifications/hooks'

export const useWebNotifications = () => {
  const [allowNotifications] = useAllowNotifications()

  // uncomment if need to add web3 notis back to feature flag
  // const featureEnabled = useExperimentalFeatureEnabled(EXPERIMENTAL_FEATURES.WebNotifications)
  // const enabled = Boolean(allowNotifications ?? featureEnabled)

  const enabled = Boolean(allowNotifications)

  return { enabled }
}
