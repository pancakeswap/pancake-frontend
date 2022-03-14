import { useMemo } from 'react'
import CompetitionBanner from '../CompetitionBanner'
import IFOBanner from '../IFOBanner'
import LotteryBanner from '../LotteryBanner'
import useIsRenderIfoBanner from './useIsRenderIFOBanner'
import useIsLotteryLoading from './useIsLotteryLoading'

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
  const isLotteryLoading = useIsLotteryLoading()
  return {
    bannerList: useMemo(
      () =>
        [
          {
            shouldRender: isRenderIFOBanner,
            banner: <IFOBanner />,
          },
          {
            shouldRender: true,
            banner: <LotteryBanner />,
          },
          {
            shouldRender: false,
            banner: <CompetitionBanner />,
          },
        ]
          .filter((d) => d.shouldRender)
          .map((d) => d.banner),
      [isRenderIFOBanner],
    ),
    isLoading: isLotteryLoading,
  }
}
