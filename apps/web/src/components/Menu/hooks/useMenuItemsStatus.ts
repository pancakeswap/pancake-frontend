import { useUserCakeLockStatus } from 'hooks/useUserCakeLockStatus'
import { useMemo } from 'react'
import { useCompetitionStatus } from './useCompetitionStatus'

export const useMenuItemsStatus = (): Record<string, string> => {
  const competitionStatus = useCompetitionStatus()
  const isUserLocked = useUserCakeLockStatus()

  return useMemo(() => {
    return {
      '/competition': competitionStatus || '',
      ...(isUserLocked && {
        '/pools': 'lock_end',
      }),
    }
  }, [competitionStatus, isUserLocked])
}
