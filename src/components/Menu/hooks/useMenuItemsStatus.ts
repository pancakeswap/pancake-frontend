import { useMemo } from 'react'
import { useCompetitionStatus } from './useCompetitionStatus'

export const useMenuItemsStatus = (): Record<string, string> => {
  const competitionStatus = useCompetitionStatus()

  const ifoStatus = null

  return useMemo(() => {
    return {
      '/competition': competitionStatus,
      '/ifo': ifoStatus === 'coming_soon' ? 'soon' : ifoStatus,
    }
  }, [competitionStatus, ifoStatus])
}
