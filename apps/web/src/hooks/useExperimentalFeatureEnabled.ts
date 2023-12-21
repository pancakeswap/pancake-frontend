import { EXPERIMENTAL_FEATURES, getCookieKey } from 'config/experimentalFeatures'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'

import { useFeatureFlagEvaluation } from './useDataDogRUM'

const isCookieInFeatureFlags = (feature: EXPERIMENTAL_FEATURES) =>
  Cookies.get(getCookieKey(feature))?.toString() === 'true'

export const useExperimentalFeatureEnabled = (featureFlag: EXPERIMENTAL_FEATURES) => {
  const [featureEnabled, setFeatureEnabled] = useState<boolean | undefined>()
  useFeatureFlagEvaluation(`experimental-${featureFlag}`, featureEnabled)

  useEffect(() => {
    const flagEnabled = isCookieInFeatureFlags(featureFlag)
    setFeatureEnabled(flagEnabled)
  }, [featureFlag])

  return featureEnabled
}
