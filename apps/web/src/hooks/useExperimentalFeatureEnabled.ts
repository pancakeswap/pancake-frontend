import { EXPERIMENTAL_FEATURES } from 'config/experminetalFeatures'
import Cookies from 'js-cookie'
import { useState } from 'react'

const useExperimentalFeatureEnabled = (featureFlag: EXPERIMENTAL_FEATURES) => {
  const isCookieInFeatureFlags = () => Cookies.get(`ctx-${featureFlag}`)?.toString() === 'true'
  const [cookieValue] = useState<boolean>(isCookieInFeatureFlags())

  return { featureEnabled: cookieValue }
}

export { useExperimentalFeatureEnabled }
