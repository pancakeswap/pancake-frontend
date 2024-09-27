import dayjs from 'dayjs'

import { useActiveIfoWithTimestamps } from 'hooks/useActiveIfoWithTimestamps'
import { useActiveIfoConfigAcrossChains } from 'hooks/useIfoConfig'

const useIsRenderIfoBanner = () => {
  const ifo = useActiveIfoWithTimestamps()

  return !!(ifo && dayjs().isBefore(dayjs.unix(ifo.endTimestamp)))
}

/**
 * Alternative to useIsRenderIfoBanner that uses the end timestamp from ifo config
 * to determine if the IFO banner should be displayed.
 * This is potentially useful for slower connections.
 */
export const useIsRenderIfoBannerFromConfig = () => {
  const ifoConfig = useActiveIfoConfigAcrossChains()

  return !!(ifoConfig && ifoConfig?.plannedEndTime && dayjs().isBefore(dayjs.unix(ifoConfig?.plannedEndTime)))
}

export default useIsRenderIfoBanner
