import shuffle from 'lodash/shuffle'
import { useMemo, type ReactElement } from 'react'
import { AlloraBanner } from '../AlloraBanner'
import CompetitionBanner from '../CompetitionBanner'
import { FeeRefundBanner } from '../FeeRefundBanner'
import { FourMemeBanner } from '../FourMemeBanner'
import { OortTradingBanner } from '../OortTradingBanner'
import { OptionsBanner } from '../OptionsBanner'
import { AthleticsBanner } from '../PancakeSwapAthleticsBanner'
import { PaymasterBanner } from '../PaymasterBanner'
import { PerpetualSeasonalBanner } from '../PerpetualSeasonalBanner'
import { PredictionBanner } from '../PredictionBanner'
import { QuestBanner } from '../QuestBanner'
import UserBanner from '../UserBanner'
import { V4InfoBanner } from '../V4InfoBanner'
import { VeCakeBanner } from '../VeCakeBanner'
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
        banner: <QuestBanner />,
      },
      {
        shouldRender: true,
        banner: <AlloraBanner />,
      },
      {
        shouldRender: true,
        banner: <OortTradingBanner />,
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
        banner: <FeeRefundBanner />,
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
