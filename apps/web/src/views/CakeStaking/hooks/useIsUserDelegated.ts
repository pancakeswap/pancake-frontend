import { useMemo } from 'react'
import { useVeCakeUserInfo } from './useVeCakeUserInfo'

export const useIsUserDelegated = (): boolean => {
  const { data: userInfo } = useVeCakeUserInfo()
  const isUserDelegated = useMemo(() => {
    return userInfo?.cakePoolType === 2
  }, [userInfo])
  return isUserDelegated
}
