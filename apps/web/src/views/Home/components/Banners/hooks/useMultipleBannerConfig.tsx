import shuffle from 'lodash/shuffle'
import { ReactElement, useMemo } from 'react'
import ArbitrumOneBanner from '../ArbitrumOneBanner'
import BaseBanner from '../BaseBanner'
import CompetitionBanner from '../CompetitionBanner'
import { GalxeTraverseBanner } from '../GalxeTraverseBanner'
import IFOBanner from '../IFOBanner'
import LineaBanner from '../LineaBanner'
import LiquidStakingBanner from '../LiquidStakingBanner'
import PerpetualBanner from '../PerpetualBanner'
import { PolygonZkEvmBanner } from '../PolygonZkEvmBanner'
import TradingRewardBanner from '../TradingRewardBanner'
import UserBanner from '../UserBanner'
import { ZksyncBanner } from '../ZksyncBanner'
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
      { shouldRender: isRenderUserBanner, banner: <UserBanner /> },
      { shouldRender: true, banner: <BaseBanner /> },
      {
        shouldRender: isRenderIFOBanner,
        banner: <IFOBanner />,
      },
    ]

    const SHUFFLE_BANNERS: IBannerConfig[] = [
      { shouldRender: true, banner: <LineaBanner /> },
      { shouldRender: true, banner: <ArbitrumOneBanner /> },
      { shouldRender: true, banner: <ZksyncBanner /> },
      { shouldRender: true, banner: <PolygonZkEvmBanner /> },
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
    return [...NO_SHUFFLE_BANNERS, ...shuffle(SHUFFLE_BANNERS)]
      .filter((bannerConfig: IBannerConfig) => bannerConfig.shouldRender)
      .map((bannerConfig: IBannerConfig) => bannerConfig.banner)
  }, [isRenderIFOBanner, isRenderCompetitionBanner, isRenderUserBanner])
}
