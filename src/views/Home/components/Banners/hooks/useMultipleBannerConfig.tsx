import { useIsRenderIfoBanner } from './useIsRenderIFOBanner'
import IFOBanner from '../IFOBanner'
import LotteryBanner from '../LotteryBanner'
import CompetitionBanner from '../CompetitionBanner'

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

  return [
    {
      shouldRender: isRenderIFOBanner,
      banner: <IFOBanner />,
    },
    {
      shouldRender: true,
      banner: <LotteryBanner />,
    },
    {
      shouldRender: true,
      banner: <CompetitionBanner />,
    },
  ]
    .filter((d) => d.shouldRender)
    .map((d) => d.banner)
}
