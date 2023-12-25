import { Box, useToast } from '@pancakeswap/uikit'
import { useInitWeb3InboxClient, useManageSubscription, useSubscription, useW3iAccount } from '@web3inbox/widget-react'
import React, { useCallback, useEffect, useState } from 'react'
import { useAppDispatch } from 'state'
import { clearArchivedTransactions } from 'state/notifications/actions'
import OnBoardingView from 'views/Notifications/containers/OnBoardingView'
import { useAccount, useSignMessage } from 'wagmi'
import NotificationMenu from './components/NotificationDropdown/NotificationMenu'
import { APP_DOMAIN, Events, TWO_MINUTES_MILLISECONDS } from './constants'
import NotificationSettingsView from './containers/NotificationSettings'
import NotificationView from './containers/NotificationView'
import { ViewContainer } from './styles'
import { PAGE_VIEW } from './types'
import { parseErrorMessage } from './utils/errorBuilder'
import { disableGlobalScroll, enableGlobalScroll } from './utils/toggleEnableScroll'

const Notifications = () => {
  const [viewIndex, setViewIndex] = useState<PAGE_VIEW>(PAGE_VIEW.OnboardView)
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [isSubscribing, setIsSubscribing] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { account, register: registerIdentity, identityKey, setAccount } = useW3iAccount()
  const { isSubscribed } = useManageSubscription(account)
  const { subscription } = useSubscription(account)
  const toast = useToast()

  const isW3iInitialized = useInitWeb3InboxClient({
    projectId: 'e542ff314e26ff34de2d4fba98db70bb',
    domain: APP_DOMAIN,
  })

  const isReady = Boolean(isSubscribed && account && isW3iInitialized)
  const onDismiss = useCallback(() => setIsMenuOpen(false), [setIsMenuOpen])
  const toggleOnboardView = useCallback(() => setViewIndex(PAGE_VIEW.OnboardView), [setViewIndex])

  const handleRegistration = useCallback(async () => {
    if (!account) return
    try {
      await registerIdentity(async (message: string) => {
        const res = await signMessageAsync({
          message,
        })
        return res as string
      })
    } catch (error) {
      const errMessage = parseErrorMessage(Events.SubscriptionRequestError, error)
      toast.toastError(Events.SubscriptionRequestError.title, errMessage)
    }
  }, [signMessageAsync, registerIdentity, account, toast])

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
    if (address) setAccount(`eip155:1:${address}`)
    if (isReady) {
      handleRegistration()
      setViewIndex(PAGE_VIEW.NotificationView)
      setIsSubscribing(false)
    }
  }, [address, isReady, setAccount, setIsSubscribing, handleRegistration])

  useEffect(() => {
    if (!subscription?.topic) return () => null

    const deleteInterval = setInterval(() => {
      dispatch(clearArchivedTransactions({ subscriptionId: subscription.topic }))
    }, TWO_MINUTES_MILLISECONDS)

    return () => clearInterval(deleteInterval)
  }, [subscription?.topic, dispatch])

  return (
    <NotificationMenu
      isMenuOpen={isMenuOpen}
      setIsMenuOpen={setIsMenuOpen}
      viewIndex={viewIndex}
      subscriptionId={subscription?.topic}
      account={account}
    >
      {() => (
        <Box tabIndex={-1} onMouseEnter={disableGlobalScroll} onMouseLeave={enableGlobalScroll}>
          <ViewContainer $viewIndex={viewIndex}>
            <OnBoardingView
              identityKey={identityKey}
              handleRegistration={handleRegistration}
              isReady={isW3iInitialized}
              isSubscribing={isSubscribing}
              setIsSubscribing={setIsSubscribing}
            />
            <NotificationView toggleSettings={toggleSettings} onDismiss={onDismiss} account={account!} />
            <NotificationSettingsView
              toggleSettings={toggleSettings}
              onDismiss={onDismiss}
              toggleOnboardView={toggleOnboardView}
              account={account!}
            />
          </ViewContainer>
        </Box>
      )}
    </NotificationMenu>
  )
}

export default React.memo(Notifications)
