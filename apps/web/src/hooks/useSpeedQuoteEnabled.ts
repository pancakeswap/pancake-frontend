import { useSpeedQuote } from '@pancakeswap/utils/user'
import { EXPERIMENTAL_FEATURES } from 'config/experimentalFeatures'
import { useExperimentalFeatureEnabled } from 'hooks/useExperimentalFeatureEnabled'

export const useSpeedQuoteEnabled = () => {
  const featureEnabled = useExperimentalFeatureEnabled(EXPERIMENTAL_FEATURES.SpeedQuote)
  const [speedQuoteEnabled] = useSpeedQuote()
  const enabled = Boolean(speedQuoteEnabled ?? featureEnabled)

  return enabled
}
