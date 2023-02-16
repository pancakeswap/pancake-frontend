import { ReactElement, useMemo } from 'react'
import shuffle from 'lodash/shuffle'
import CompetitionBanner from '../CompetitionBanner'
import IFOBanner from '../IFOBanner'
import PerpetualBanner from '../PerpetualBanner'
import useIsRenderIfoBanner from './useIsRenderIFOBanner'
import useIsRenderCompetitionBanner from './useIsRenderCompetitionBanner'
import AptosBanner from '../AptosBanner'
import TrustWalletCampaignBanner from '../TrustWalletCampaignBanner'

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

  return useMemo(() => {
    const NO_SHUFFLE_BANNERS: IBannerConfig[] = [
      { shouldRender: true, banner: <TrustWalletCampaignBanner /> },
      { shouldRender: true, banner: <AptosBanner /> },
      {
        shouldRender: isRenderIFOBanner,
        banner: <IFOBanner />,
      },
    ]

    const SHUFFLE_BANNERS: IBannerConfig[] = [
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
  }, [isRenderIFOBanner, isRenderCompetitionBanner])
}
