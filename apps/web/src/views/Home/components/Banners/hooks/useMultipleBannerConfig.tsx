import shuffle from 'lodash/shuffle'
import { ReactElement, useMemo } from 'react'
import BaseBanner from '../BaseBanner'
import CompetitionBanner from '../CompetitionBanner'
import GalxePedictBanner from '../GalxePedictBanner'
import GalxeSyndicateBanner from '../GalxeSyndicateBanner'
import { GalxeTraverseBanner } from '../GalxeTraverseBanner'
import IFOBanner from '../IFOBanner'
import LiquidStakingBanner from '../LiquidStakingBanner'
import { OpBnbBanner } from '../OpBnbBanner'
import PerpetualBanner from '../PerpetualBanner'
import TradingRewardBanner from '../TradingRewardBanner'
import UserBanner from '../UserBanner'
import useIsRenderCompetitionBanner from './useIsRenderCompetitionBanner'
import useIsRenderIfoBanner from './useIsRenderIFOBanner'
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
  const isRenderIFOBanner = useIsRenderIfoBanner()
  const isRenderCompetitionBanner = useIsRenderCompetitionBanner()
  const isRenderUserBanner = useIsRenderUserBanner()

  return useMemo(() => {
    const NO_SHUFFLE_BANNERS: IBannerConfig[] = [
      {
        shouldRender: isRenderUserBanner.shouldRender && !isRenderUserBanner.isEarningsBusdZero,
        banner: <UserBanner />,
      },
      { shouldRender: true, banner: <GalxeSyndicateBanner /> },
      { shouldRender: true, banner: <GalxePedictBanner /> },
      { shouldRender: true, banner: <OpBnbBanner /> },
      { shouldRender: true, banner: <BaseBanner /> },
      {
        shouldRender: isRenderIFOBanner,
        banner: <IFOBanner />,
      },
    ]

    const SHUFFLE_BANNERS: IBannerConfig[] = [
      // { shouldRender: true, banner: <LineaBanner /> },
      // { shouldRender: true, banner: <ArbitrumOneBanner /> },
      // { shouldRender: true, banner: <ZksyncBanner /> },
      // { shouldRender: true, banner: <PolygonZkEvmBanner /> },
      { shouldRender: true, banner: <GalxeTraverseBanner /> },
      { shouldRender: true, banner: <TradingRewardBanner /> },
      { shouldRender: true, banner: <LiquidStakingBanner /> },
      {
        shouldRender: isRenderCompetitionBanner,
        banner: <CompetitionBanner />,
      },
      {
        shouldRender: true,
        banner: <PerpetualBanner />,
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
  }, [isRenderIFOBanner, isRenderCompetitionBanner, isRenderUserBanner])
}
