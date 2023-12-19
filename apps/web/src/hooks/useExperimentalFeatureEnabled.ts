import { EXPERIMENTAL_FEATURES, getCookieKey } from 'config/experminetalFeatures'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { datadogRum } from '@datadog/browser-rum'

const isCookieInFeatureFlags = (feature: EXPERIMENTAL_FEATURES) =>
  Cookies.get(getCookieKey(feature))?.toString() === 'true'

export const useExperimentalFeatureEnabled = (featureFlag: EXPERIMENTAL_FEATURES) => {
  const [featureEnabled, setFeatureEnabled] = useState<boolean | undefined>()

  useEffect(() => {
    const flagEnabled = isCookieInFeatureFlags(featureFlag)
    setFeatureEnabled(flagEnabled)
    datadogRum.addFeatureFlagEvaluation(featureFlag, flagEnabled)
  }, [featureFlag])

  return featureEnabled
}
