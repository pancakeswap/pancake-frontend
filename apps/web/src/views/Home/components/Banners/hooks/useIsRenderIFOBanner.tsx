import dayjs from 'dayjs'

import { useActiveIfoWithTimestamps } from 'hooks/useActiveIfoWithTimestamps'

const useIsRenderIfoBanner = () => {
  const ifo = useActiveIfoWithTimestamps()

  return !!(ifo && dayjs().isBefore(dayjs.unix(ifo.endTimestamp)))
}

export default useIsRenderIfoBanner
