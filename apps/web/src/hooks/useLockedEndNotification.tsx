import { useToast, Text, Link } from '@pancakeswap/uikit'
import { useEffect } from 'react'
import { useCakeVaultUserData } from 'state/pools/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { useUserLockedCakeStatus } from 'views/Farms/hooks/useUserLockedCakeStatus'
import { useAtom } from 'jotai'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import { ChainId } from '@pancakeswap/sdk'

const storage = createJSONStorage(() => sessionStorage)
storage.delayInit = true
const lockedNotificationShowAtom = atomWithStorage('lockedNotificationShow', true, storage)
function useLockedNotificationShow() {
  return useAtom(lockedNotificationShowAtom)
}

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
  const { chainId } = useActiveChainId()
  if (
    chainId === ChainId.BSC &&
    !isLoading &&
    locked &&
    (lockedEnd === '0' || new Date() > new Date(parseInt(lockedEnd) * 1000))
  )
    return true
  return false
}

const useLockedEndNotification = () => {
  useCakeVaultUserData()
  const { t } = useTranslation()
  const isUserLockedEnd = useIsUserLockedEnd()
  const { chainId } = useActiveChainId()
  const { toastInfo } = useToast()
  const [lockedNotificationShow, setLockedNotificationShow] = useLockedNotificationShow()
  useEffect(() => {
    if (toastInfo && isUserLockedEnd && lockedNotificationShow && chainId === ChainId.BSC) {
      toastInfo(t('Cake Syrup Pool'), <LockedEndDescription />)
      setLockedNotificationShow(false) // show once
    }
  }, [isUserLockedEnd, toastInfo, lockedNotificationShow, setLockedNotificationShow, t, chainId])
}

export default useLockedEndNotification
