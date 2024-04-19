import dayjs from 'dayjs'

import { useCurrentBlockTimestamp as useBlockTimestamp } from 'state/block/hooks'

export const useCurrentBlockTimestamp = () => {
  const timestamp = useBlockTimestamp()

  return timestamp ?? dayjs().unix()
}
