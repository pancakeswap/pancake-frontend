import shuffle from 'lodash/shuffle'
import { useMemo, type ReactElement } from 'react'
import { AlloraBanner } from '../AlloraBanner'
import { BirthdayBanner } from '../BirthdayBanner'
import CompetitionBanner from '../CompetitionBanner'
import { FourMemeBanner } from '../FourMemeBanner'
import { V4HackathonBanner } from '../HackathonBanner'
import { OptionsBanner } from '../OptionsBanner'
import { AthleticsBanner } from '../PancakeSwapAthleticsBanner'
import { PaymasterBanner } from '../PaymasterBanner'
import { PerpetualSeasonalBanner } from '../PerpetualSeasonalBanner'
import { PredictionBanner } from '../PredictionBanner'
import { QuestBanner } from '../QuestBanner'
import { TopperCampaignBanner } from '../TopperCampaignBanner'
import UserBanner from '../UserBanner'
import { V4InfoBanner } from '../V4InfoBanner'
import { VeCakeBanner } from '../VeCakeBanner'
import WebNotificationBanner from '../WebNotificationBanner'
import { ZksyncAirDropBanner } from '../ZksyncAirdropBanner'
import useIsRenderCompetitionBanner from './useIsRenderCompetitionBanner'
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

  return useMemo(() => {
    const NO_SHUFFLE_BANNERS: IBannerConfig[] = [
      {
        shouldRender: isRenderUserBanner.shouldRender && !isRenderUserBanner.isEarningsBusdZero,
        banner: <UserBanner />,
      },
      {
        shouldRender: true,
        banner: <TopperCampaignBanner />,
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
        banner: <AlloraBanner />,
      },
      {
        shouldRender: true,
        banner: <AthleticsBanner />,
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
        banner: <PredictionBanner />,
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
  }, [isRenderCompetitionBanner, isRenderUserBanner.isEarningsBusdZero, isRenderUserBanner.shouldRender])
}
