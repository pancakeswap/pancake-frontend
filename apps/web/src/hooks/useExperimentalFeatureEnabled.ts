import { atom, useAtom, useSetAtom, useAtomValue } from 'jotai'
import Cookies from 'js-cookie'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { EXPERIMENTAL_FEATURES, EXPERIMENTAL_FEATURE_CONFIGS, getCookieKey } from 'config/experimentalFeatures'

import { FeatureFlagEvaluation, useFeatureFlagEvaluations } from './useDataDogRUM'

export type FeatureFlags = { [flag in EXPERIMENTAL_FEATURES]?: boolean }

const experimentalFeaturesAtom = atom<FeatureFlags>({})

export function useFeatureFlags() {
  return useAtomValue(experimentalFeaturesAtom)
}

export function useSetExperimentalFeatures() {
  return useSetAtom(experimentalFeaturesAtom)
}

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

export function useLoadExperimentalFeatures() {
  const [experimentalFeatures, setExperimentalFeatures] = useAtom(experimentalFeaturesAtom)
  const [evaluations, setEvaluations] = useState<FeatureFlagEvaluation[] | undefined>()
  useFeatureFlagEvaluations(evaluations)

  useEffect(() => {
    const featureFlags: FeatureFlags = {}
    for (const { feature } of EXPERIMENTAL_FEATURE_CONFIGS) {
      const hasFeatureFlag = hasFeatureFlagsInCookies(feature)
      featureFlags[feature] = hasFeatureFlag
    }
    setExperimentalFeatures((prev) => ({ ...prev, ...featureFlags }))
  }, [setExperimentalFeatures])

  useEffect(() => {
    const featureEvaluations: FeatureFlagEvaluation[] = []
    for (const [feature, value] of Object.entries(experimentalFeatures)) {
      featureEvaluations.push({ flagName: `experimental-${feature}`, value })
    }
    setEvaluations(featureEvaluations)
  }, [experimentalFeatures])
}
