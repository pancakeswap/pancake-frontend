import { useActiveIfoWithBlocks } from 'hooks/useActiveIfoWithBlocks'
import useLedgerTimestamp from 'hooks/useLedgerTimestamp'
import { useMemo } from 'react'
import { getStatus } from 'views/Ifos/hooks/helpers'

export const useMenuItemsStatus = (): Record<string, string> => {
  const getNow = useLedgerTimestamp()
  const activeIfo = useActiveIfoWithBlocks()

  const nowInSeconds = getNow() / 1000

  const ifoStatus =
    nowInSeconds && activeIfo && activeIfo.endTime > nowInSeconds
      ? getStatus(nowInSeconds, activeIfo.startTime, activeIfo.endTime)
      : ''

  return useMemo(() => {
    return {
      '/ifo': ifoStatus === 'coming_soon' ? 'soon' : ifoStatus,
    }
  }, [ifoStatus])
}
