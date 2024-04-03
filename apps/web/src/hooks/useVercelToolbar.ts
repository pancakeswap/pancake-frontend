import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

import { isVercelToolbarEnabled, shouldInjectVercelToolbar } from 'utils/vercelToolbar'
import { useSetExperimentalFeatures, type FeatureFlags } from './useExperimentalFeatureEnabled'

export function useShouldInjectVercelToolbar() {
  const [shouldInject] = useState(shouldInjectVercelToolbar())
  return shouldInject
}

export function useVercelToolbarEnabled() {
  const [enabled] = useState(isVercelToolbarEnabled())
  return enabled
}

export function useVercelFeatureFlagOverrides() {
  const setFlags = useSetExperimentalFeatures()
  useEffect(() => {
    const serializedFlags = Cookies.get('vercel-flag-overrides')
    const flags = serializedFlags ? JSON.parse(serializedFlags) : undefined
    setFlags((prev: FeatureFlags) => ({
      ...prev,
      ...flags,
    }))
  }, [setFlags])
}
