import { atom, useAtom } from 'jotai'
import Cookies from 'js-cookie'
import { useCallback, useEffect, useMemo } from 'react'

import { EXPERIMENTAL_FEATURES, getCookieKey } from 'config/experimentalFeatures'

import { useFeatureFlagEvaluation } from './useDataDogRUM'

const experimentalFeaturesAtom = atom<{ [flag in EXPERIMENTAL_FEATURES]?: boolean }>({})

export function useExperimentalFeature(featureFlag: EXPERIMENTAL_FEATURES) {
  const [features, setFeatures] = useAtom(experimentalFeaturesAtom)
  const setEnabled = useCallback(
    (enabled?: boolean) => {
      setFeatures((prev) => ({
        ...prev,
        [featureFlag]: enabled,
      }))
    },
    [featureFlag, setFeatures],
  )
  const enabled = useMemo(() => features[featureFlag], [features, featureFlag])

  return { enabled, setEnabled }
}

const hasFeatureFlagsInCookies = (feature: EXPERIMENTAL_FEATURES) =>
  Cookies.get(getCookieKey(feature))?.toString() === 'true'

export function useExperimentalFeatureEnabled(feature: EXPERIMENTAL_FEATURES) {
  const { enabled } = useExperimentalFeature(feature)
  return enabled
}

export function useLoadExperimentalFeature(feature: EXPERIMENTAL_FEATURES) {
  const { enabled, setEnabled } = useExperimentalFeature(feature)
  useFeatureFlagEvaluation(`experimental-${feature}`, enabled)

  useEffect(() => {
    const hasFeatureFlag = hasFeatureFlagsInCookies(feature)
    setEnabled(hasFeatureFlag)
  }, [feature, setEnabled])
}

export function useLoadExperimentalFeatures() {
  useLoadExperimentalFeature(EXPERIMENTAL_FEATURES.WebNotifications)
}
