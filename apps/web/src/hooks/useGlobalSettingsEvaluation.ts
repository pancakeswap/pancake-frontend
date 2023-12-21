import { useAudioPlay, useExpertMode, useUserSingleHopOnly, useUserSlippage } from '@pancakeswap/utils/user'

import { useFeatureFlagEvaluation } from 'hooks/useDataDogRUM'
import { useWebNotifications } from 'hooks/useWebNotifications'
import {
  useGasPriceManager,
  useSubgraphHealthIndicatorManager,
  useUserTransactionTTL,
  useUserUsernameVisibility,
} from 'state/user/hooks'
import useTheme from 'hooks/useTheme'
import { useUserTokenRisk } from 'state/user/hooks/useUserTokenRisk'
import {
  useUserSplitRouteEnable,
  useUserStableSwapEnable,
  useUserV2SwapEnable,
  useUserV3SwapEnable,
} from 'state/user/smartRouter'
import { useMMLinkedPoolByDefault } from 'state/user/mmLinkedPool'

export function useGlobalSettingsEvaluation() {
  const [gasPrice] = useGasPriceManager()
  useFeatureFlagEvaluation('global-settings-gas-price', gasPrice)

  const [expertMode] = useExpertMode()
  const [audioPlay] = useAudioPlay()
  const [subgraphHealth] = useSubgraphHealthIndicatorManager()
  const [userUsernameVisibility] = useUserUsernameVisibility()
  const { enabled } = useWebNotifications()
  useFeatureFlagEvaluation('global-settings-expert-mode', expertMode)
  useFeatureFlagEvaluation('global-settings-audio-play', audioPlay)
  useFeatureFlagEvaluation('global-settings-subgraph-health-indicator', subgraphHealth)
  useFeatureFlagEvaluation('global-settings-user-name', userUsernameVisibility)
  useFeatureFlagEvaluation('global-settings-web-notification', enabled)

  const [tokenRisk] = useUserTokenRisk()
  useFeatureFlagEvaluation('global-settings-token-risk', tokenRisk)

  const { isDark } = useTheme()
  useFeatureFlagEvaluation('global-settings-dark-mode', isDark)

  const [isStableSwapByDefault] = useUserStableSwapEnable()
  const [v2Enable] = useUserV2SwapEnable()
  const [v3Enable] = useUserV3SwapEnable()
  const [split] = useUserSplitRouteEnable()
  const [isMMLinkedPoolByDefault] = useMMLinkedPoolByDefault()
  const [singleHopOnly] = useUserSingleHopOnly()
  useFeatureFlagEvaluation('global-settings-routing-stableswap', isStableSwapByDefault)
  useFeatureFlagEvaluation('global-settings-routing-v2', v2Enable)
  useFeatureFlagEvaluation('global-settings-routing-v3', v3Enable)
  useFeatureFlagEvaluation('global-settings-routing-split', split)
  useFeatureFlagEvaluation('global-settings-routing-mm', isMMLinkedPoolByDefault)
  useFeatureFlagEvaluation('global-settings-routing-single-hop', singleHopOnly)

  const [userSlippageTolerance] = useUserSlippage()
  const [ttl] = useUserTransactionTTL()
  useFeatureFlagEvaluation('tx-settings-slippage', userSlippageTolerance)
  useFeatureFlagEvaluation('tx-settings-ttl', ttl)
}
