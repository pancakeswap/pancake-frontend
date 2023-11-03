import { Box } from '@pancakeswap/uikit'
import { useManageSubscription } from '@web3inbox/widget-react'
import React, { useCallback, useEffect, useState } from 'react'
import OnBoardingView from 'views/Notifications/containers/OnBoardingView'
import NotificationMenu from './components/NotificationDropdown/NotificationMenu'
import NotificationSettingsView from './containers/NotificationSettings'
import NotificationView from './containers/NotificationView'
import useRegistration from './hooks/useRegistration'
import { ViewContainer } from './styles'
import { PAGE_VIEW } from './types'

const Notifications = () => {
  const [viewIndex, setViewIndex] = useState<PAGE_VIEW>(PAGE_VIEW.OnboardView)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const { account, identityKey, handleRegistration, address, isW3iInitialized } = useRegistration()
  const { isSubscribed } = useManageSubscription(account)

  const isReady = Boolean(isSubscribed && address && isW3iInitialized)
  const isRegistered = Boolean(!identityKey && isSubscribed)

  const onDismiss = useCallback(() => setIsMenuOpen(false), [setIsMenuOpen])
  const toggleOnboardView = useCallback(() => setViewIndex(PAGE_VIEW.OnboardView), [setViewIndex])
  const toggleSettings = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      if (viewIndex === PAGE_VIEW.OnboardView || viewIndex === PAGE_VIEW.SettingsView)
        setViewIndex(PAGE_VIEW.NotificationView)
      else setViewIndex(PAGE_VIEW.SettingsView)
    },
    [setViewIndex, viewIndex],
  )

  useEffect(() => {
    if (!address || !isReady) setViewIndex(PAGE_VIEW.OnboardView)
    if (isReady) setViewIndex(PAGE_VIEW.NotificationView)
  }, [address, isReady])

  return (
    <NotificationMenu
      isMenuOpen={isMenuOpen}
      setIsMenuOpen={setIsMenuOpen}
      isRegistered={isRegistered}
      handleRegistration={handleRegistration}
    >
      {() => (
        <Box tabIndex={-1}>
          <ViewContainer viewIndex={viewIndex}>
            <OnBoardingView
              identityKey={identityKey}
              handleRegistration={handleRegistration}
              isReady={isW3iInitialized}
            />
            <NotificationView toggleSettings={toggleSettings} onDismiss={onDismiss} />
            <NotificationSettingsView
              toggleSettings={toggleSettings}
              onDismiss={onDismiss}
              toggleOnboardView={toggleOnboardView}
            />
          </ViewContainer>
        </Box>
      )}
    </NotificationMenu>
  )
}

export default React.memo(Notifications)
