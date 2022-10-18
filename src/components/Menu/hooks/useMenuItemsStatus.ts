import { useMemo } from 'react'

export const useMenuItemsStatus = (): Record<string, string> => {
  return useMemo(() => {
    return {
      '/competition': null,
      '/ifo': null,
    }
  }, [])
}
