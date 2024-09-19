import { EXPERIMENTAL_FEATURES } from 'config/experimentalFeatures'
import { useExperimentalFeatureEnabled } from 'hooks/useExperimentalFeatureEnabled'
import { useUserXEnable } from 'state/user/smartRouter'

export const usePCSX = () => {
  const featureEnabled = useExperimentalFeatureEnabled(EXPERIMENTAL_FEATURES.PCSX)
  const [xEnabled, setX] = useUserXEnable()
  const enabled = Boolean(xEnabled ?? featureEnabled)

  return [enabled, setX] as const
}
