import shuffle from 'lodash/shuffle'
import { type ReactElement, useMemo } from 'react'
import CompetitionBanner from '../CompetitionBanner'
import { EigenpieIFOBanner } from '../EigenpieIFOBanner'
import { FourMemeBanner } from '../FourMemeBanner'
import { OptionsBanner } from '../OptionsBanner'
import { PCSXBanner } from '../PCSXBanner'
import { QuestBanner } from '../QuestBanner'
import { TgPredictionBotBanner } from '../TgPredictionBotBanner'
import UserBanner from '../UserBanner'
import { V4InfoBanner } from '../V4InfoBanner'
import { VeCakeBanner } from '../VeCakeBanner'
import WebNotificationBanner from '../WebNotificationBanner'
import useIsRenderCompetitionBanner from './useIsRenderCompetitionBanner'
import { useIsRenderIfoBannerFromConfig } from './useIsRenderIFOBanner'
import useIsRenderUserBanner from './useIsRenderUserBanner'

interface IBannerConfig {
  shouldRender: boolean
  banner: ReactElement
}

/**
 * make your custom hook to control should render specific banner or not
 * add new campaign banner easily
 *
 * @example
 * ```ts
 *  {
 *    shouldRender: isRenderIFOBanner,
 *    banner: <IFOBanner />,
 *  },
 * ```
 */

export const useMultipleBannerConfig = () => {
  const isRenderCompetitionBanner = useIsRenderCompetitionBanner()
  const isRenderUserBanner = useIsRenderUserBanner()
  const isRenderIFOBannerFromConfig = useIsRenderIfoBannerFromConfig()

  return useMemo(() => {
    const NO_SHUFFLE_BANNERS: IBannerConfig[] = [
      {
        shouldRender: isRenderUserBanner.shouldRender && !isRenderUserBanner.isEarningsBusdZero,
        banner: <UserBanner />,
      },
      {
        shouldRender: isRenderIFOBannerFromConfig,
        banner: <EigenpieIFOBanner />,
      },
      {
        shouldRender: true,
        banner: <PCSXBanner />,
      },
      {
        shouldRender: true,
        banner: <TgPredictionBotBanner />,
      },
      {
        shouldRender: true,
        banner: <WebNotificationBanner />,
      },
      {
        shouldRender: true,
        banner: <QuestBanner />,
      },
      {
        shouldRender: true,
        banner: <FourMemeBanner />,
      },
      {
        shouldRender: true,
        banner: <OptionsBanner />,
      },
      { shouldRender: true, banner: <VeCakeBanner /> },
      {
        shouldRender: true,
        banner: <V4InfoBanner />,
      },
    ]

    const SHUFFLE_BANNERS: IBannerConfig[] = [
      {
        shouldRender: isRenderCompetitionBanner,
        banner: <CompetitionBanner />,
      },
    ]
    return [
      ...NO_SHUFFLE_BANNERS,
      ...shuffle(SHUFFLE_BANNERS),
      {
        // be the last one if harvest value is zero
        shouldRender: isRenderUserBanner.shouldRender && isRenderUserBanner.isEarningsBusdZero,
        banner: <UserBanner />,
      },
    ]
      .filter((bannerConfig: IBannerConfig) => bannerConfig.shouldRender)
      .map((bannerConfig: IBannerConfig) => bannerConfig.banner)
  }, [
    isRenderCompetitionBanner,
    isRenderUserBanner.isEarningsBusdZero,
    isRenderUserBanner.shouldRender,
    isRenderIFOBannerFromConfig,
  ])
}
