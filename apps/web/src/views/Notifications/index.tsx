import { Box } from '@pancakeswap/uikit'
import { useManageSubscription, useSubscription } from '@web3inbox/widget-react'
import React, { useCallback, useEffect, useState } from 'react'
import OnBoardingView from 'views/Notifications/containers/OnBoardingView'
import NotificationMenu from './components/NotificationDropdown/NotificationMenu'
import NotificationSettingsView from './containers/NotificationSettings'
import NotificationView from './containers/NotificationView'
import useRegistration from './hooks/useRegistration'
import { ViewContainer } from './styles'
import { PAGE_VIEW } from './types'
import { clearArchivedTransactions } from 'state/notifications/actions'
import { useAppDispatch } from 'state'

const Notifications = () => {
  const [viewIndex, setViewIndex] = useState<PAGE_VIEW>(PAGE_VIEW.OnboardView)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const { account, identityKey, handleRegistration, address, isW3iInitialized } = useRegistration()
  const dispatch = useAppDispatch()
  const { isSubscribed } = useManageSubscription(account)
  const { subscription } = useSubscription(account)

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

  useEffect(() => {
    if (!subscription?.topic) return () => null

    const deleteInterval = setInterval(() => {
      dispatch(clearArchivedTransactions({ subscriptionId: subscription.topic }))
    }, 360000)

    return () => clearInterval(deleteInterval)
  }, [subscription?.topic, dispatch])

  return (
    <NotificationMenu
      isMenuOpen={isMenuOpen}
      setIsMenuOpen={setIsMenuOpen}
      isRegistered={isRegistered}
      handleRegistration={handleRegistration}
      viewIndex={viewIndex}
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
