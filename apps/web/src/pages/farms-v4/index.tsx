import { SUPPORT_FARMS } from 'config/constants/supportChains'
import { EXPERIMENTAL_FEATURES } from 'config/experimentalFeatures'
import { useExperimentalFeatureEnabled } from 'hooks/useExperimentalFeatureEnabled'
import { useEffect } from 'react'
import { FarmsV4 } from 'views/Farms/FarmsV4'

const FarmsPage = () => {
  const enabled = useExperimentalFeatureEnabled(EXPERIMENTAL_FEATURES.V4Farm)
  useEffect(() => {
    console.info('enabled', enabled)
    if (!enabled) {
      window.location.replace('/farms')
    }
  }, [enabled])

  if (!enabled) {
    return null
  }

  return FarmsV4
}

FarmsPage.chains = SUPPORT_FARMS

export default FarmsPage
