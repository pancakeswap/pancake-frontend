import shuffle from 'lodash/shuffle'
import { type ReactElement, useMemo } from 'react'
import { BirthdayBanner } from '../BirthdayBanner'
import CompetitionBanner from '../CompetitionBanner'
import { EigenpieIFOBanner } from '../EigenpieIFOBanner'
import { FourMemeBanner } from '../FourMemeBanner'
import { V4HackathonBanner } from '../HackathonBanner'
import { OptionsBanner } from '../OptionsBanner'
import { PaymasterBanner } from '../PaymasterBanner'
import { PerpetualSeasonalBanner } from '../PerpetualSeasonalBanner'
import { QuestBanner } from '../QuestBanner'
import { TgPredictionBotBanner } from '../TgPredictionBotBanner'
import UserBanner from '../UserBanner'
import { V4InfoBanner } from '../V4InfoBanner'
import { VeCakeBanner } from '../VeCakeBanner'
import WebNotificationBanner from '../WebNotificationBanner'
import { ZksyncAirDropBanner } from '../ZksyncAirdropBanner'
import useIsRenderCompetitionBanner from './useIsRenderCompetitionBanner'
import { useIsRenderIfoBannerFromConfig } from './useIsRenderIFOBanner'
import { useIsRenderTgPredictionBotBanner } from './useIsRenderTgPredictionBotBanner'
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
  const isRenderTgPredictionBotBanner = useIsRenderTgPredictionBotBanner()
  const isRenderIFOBannerFromConfig = useIsRenderIfoBannerFromConfig()

  return useMemo(() => {
    const NO_SHUFFLE_BANNERS: IBannerConfig[] = [
      {
        shouldRender: isRenderIFOBannerFromConfig,
        banner: <EigenpieIFOBanner />,
      },
      {
        shouldRender: isRenderUserBanner.shouldRender && !isRenderUserBanner.isEarningsBusdZero,
        banner: <UserBanner />,
      },
      {
        shouldRender: isRenderTgPredictionBotBanner,
        banner: <TgPredictionBotBanner />,
      },
      {
        shouldRender: true,
        banner: <V4HackathonBanner />,
      },
      {
        shouldRender: true,
        banner: <WebNotificationBanner />,
      },
      {
        shouldRender: true,
        banner: <BirthdayBanner />,
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
        banner: <ZksyncAirDropBanner />,
      },
      {
        shouldRender: true,
        banner: <PerpetualSeasonalBanner />,
      },
      {
        shouldRender: true,
        banner: <PaymasterBanner />,
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
    isRenderTgPredictionBotBanner,
    isRenderUserBanner.isEarningsBusdZero,
    isRenderUserBanner.shouldRender,
    isRenderIFOBannerFromConfig,
  ])
}
