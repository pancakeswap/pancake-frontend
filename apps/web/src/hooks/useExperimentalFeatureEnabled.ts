import { EXPERIMENTAL_FEATURES, getCookieKey } from 'config/experminetalFeatures'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'

const isCookieInFeatureFlags = (feature: EXPERIMENTAL_FEATURES) =>
  Cookies.get(getCookieKey(feature))?.toString() === 'true'

export const useExperimentalFeatureEnabled = (featureFlag: EXPERIMENTAL_FEATURES) => {
  const [featureEnabled, setFeatureEnabled] = useState<boolean | undefined>()

  useEffect(() => {
    const cookie = isCookieInFeatureFlags(featureFlag)
    setFeatureEnabled(cookie)
  }, [featureFlag])

  return featureEnabled
}
