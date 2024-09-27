import {
  useAudioPlay,
  useExpertMode,
  useUserSingleHopOnly,
  useUserSlippage,
  useSpeedQuote,
} from '@pancakeswap/utils/user'

import { useFeatureFlagEvaluation } from 'hooks/useDataDogRUM'
import useTheme from 'hooks/useTheme'
import { useWebNotifications } from 'hooks/useWebNotifications'
import { useGasPriceManager, useSubgraphHealthIndicatorManager, useUserUsernameVisibility } from 'state/user/hooks'
import { useUserChart } from 'state/user/hooks/useUserChart'
import { useUserTokenRisk } from 'state/user/hooks/useUserTokenRisk'
import {
  useUserSplitRouteEnable,
  useUserStableSwapEnable,
  useUserV2SwapEnable,
  useUserV3SwapEnable,
} from 'state/user/smartRouter'
import { useIsSwapHotTokenDisplayFlag } from './useSwapHotTokenDisplay'
import { useTransactionDeadline } from './useTransactionDeadline'

export function useGlobalSettingsEvaluation() {
  const [gasPrice] = useGasPriceManager()
  useFeatureFlagEvaluation('global-settings-gas-price', gasPrice)

  const [expertMode] = useExpertMode()
  const [audioPlay] = useAudioPlay()
  const [subgraphHealth] = useSubgraphHealthIndicatorManager()
  const [userUsernameVisibility] = useUserUsernameVisibility()
  const { enabled } = useWebNotifications()
  const [userChart] = useUserChart(false)
  const isSwapHotTokenDisplay = useIsSwapHotTokenDisplayFlag()
  useFeatureFlagEvaluation('global-settings-expert-mode', expertMode)
  useFeatureFlagEvaluation('global-settings-audio-play', audioPlay)
  useFeatureFlagEvaluation('global-settings-subgraph-health-indicator', subgraphHealth)
  useFeatureFlagEvaluation('global-settings-user-name', userUsernameVisibility)
  useFeatureFlagEvaluation('global-settings-web-notification', enabled)
  useFeatureFlagEvaluation('global-settings-chart', userChart)
  useFeatureFlagEvaluation('global-settings-hot-token-display', isSwapHotTokenDisplay)

  const [tokenRisk] = useUserTokenRisk()
  useFeatureFlagEvaluation('global-settings-token-risk', tokenRisk)

  const { isDark } = useTheme()
  useFeatureFlagEvaluation('global-settings-dark-mode', isDark)

  const [isStableSwapByDefault] = useUserStableSwapEnable()
  const [v2Enable] = useUserV2SwapEnable()
  const [v3Enable] = useUserV3SwapEnable()
  const [split] = useUserSplitRouteEnable()
  const [singleHopOnly] = useUserSingleHopOnly()
  const [speedQuote] = useSpeedQuote()
  useFeatureFlagEvaluation('global-settings-routing-stableswap', isStableSwapByDefault)
  useFeatureFlagEvaluation('global-settings-routing-v2', v2Enable)
  useFeatureFlagEvaluation('global-settings-routing-v3', v3Enable)
  useFeatureFlagEvaluation('global-settings-routing-split', split)
  useFeatureFlagEvaluation('global-settings-routing-single-hop', singleHopOnly)
  useFeatureFlagEvaluation('global-settings-speed-quote', speedQuote)

  const [userSlippageTolerance] = useUserSlippage()
  const [ttl] = useTransactionDeadline()
  useFeatureFlagEvaluation('tx-settings-slippage', userSlippageTolerance)
  useFeatureFlagEvaluation('tx-settings-ttl', ttl)
}
