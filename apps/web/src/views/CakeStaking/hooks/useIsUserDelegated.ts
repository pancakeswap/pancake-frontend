import { useMemo } from 'react'
import { CakePoolType } from '../types'
import { useVeCakeUserInfo } from './useVeCakeUserInfo'

export const useIsUserDelegated = (): boolean => {
  const { data: userInfo } = useVeCakeUserInfo()
  const isUserDelegated = useMemo(() => {
    return userInfo?.cakePoolType === CakePoolType.DELEGATED
  }, [userInfo])
  return isUserDelegated
}
