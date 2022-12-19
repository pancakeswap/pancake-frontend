import { useToast, Text, Link } from '@pancakeswap/uikit'
import { useEffect } from 'react'
import { useCakeVaultUserData } from 'state/pools/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { useUserLockedCakeStatus } from 'views/Farms/hooks/useUserLockedCakeStatus'

const LockedEndDescription: React.FC = () => {
  const { t } = useTranslation()
  return (
    <Text>
      <>
        {t('The locked staking duration has ended.')}
        <Link href="/pools">{t('Go to Pools')}</Link>
      </>
    </Text>
  )
}

export const useIsUserLockedEnd = () => {
  const { isLoading, locked, lockedEnd } = useUserLockedCakeStatus()
  if (!isLoading && locked && (lockedEnd === '0' || new Date() > new Date(parseInt(lockedEnd) * 1000))) return true
  return false
}

const useLockedEndNotification = () => {
  useCakeVaultUserData()
  const isUserLockedEnd = useIsUserLockedEnd()
  const { toastInfo } = useToast()
  useEffect(() => {
    if (toastInfo && isUserLockedEnd) {
      toastInfo('Cake Syrup Pool', <LockedEndDescription />)
    }
  }, [isUserLockedEnd, toastInfo])
}

export default useLockedEndNotification
