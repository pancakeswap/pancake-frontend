import { EXPERIMENTAL_FEATURES } from 'config/experminetalFeatures'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'

const useExperimentalFeatureEnabled = (featureFlag: EXPERIMENTAL_FEATURES) => {
  const [featureEnabled, setFeatureEnabled] = useState<boolean | null>(null)
  const isCookieInFeatureFlags = () => Cookies.get(`ctx-${featureFlag}`)?.toString() === 'true'

  useEffect(() => {
    const cookie = isCookieInFeatureFlags()
    setFeatureEnabled(cookie)
  }, [isCookieInFeatureFlags])

  return { featureEnabled }
}

export { useExperimentalFeatureEnabled }
