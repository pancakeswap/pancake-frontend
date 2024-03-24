import { Box } from '@pancakeswap/uikit'
import { initWeb3InboxClient, useSubscription, useWeb3InboxAccount, useWeb3InboxClient } from '@web3inbox/react'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import NotificationMenu from './components/NotificationDropdown/NotificationMenu'
import { APP_DOMAIN } from './constants'
import NotificationSettings from './containers/NotificationSettings'
import NotificationView from './containers/NotificationView'
import OnBoardingView from './containers/OnBoardingView'
import { ViewContainer } from './styles'
import { PAGE_VIEW } from './types'
import { disableGlobalScroll, enableGlobalScroll } from './utils/toggleEnableScroll'

interface INotificationWidget {
  isRegistered: boolean
}

initWeb3InboxClient({
  projectId: 'e542ff314e26ff34de2d4fba98db70bb',
  domain: APP_DOMAIN,
  allApps: true,
})

const Notifications = () => {
  const { address } = useAccount()

  const { data: client } = useWeb3InboxClient()
  const { data: account, isRegistered } = useWeb3InboxAccount(`eip155:1:${address}`)

  const isReady = Boolean(client)

  if (!isReady || !account) return null
  return <NotificationsWidget isRegistered={isRegistered} />
}

const NotificationsWidget = memo(({ isRegistered }: INotificationWidget) => {
  const [viewIndex, setViewIndex] = useState<PAGE_VIEW>(PAGE_VIEW.OnboardView)

  const { data: subscription } = useSubscription()
  const isSubscribed = Boolean(subscription)

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
    if (!isSubscribed) setViewIndex(PAGE_VIEW.OnboardView)
    if (isSubscribed) setViewIndex(PAGE_VIEW.NotificationView)
  }, [isSubscribed])

  return (
    <NotificationMenu viewIndex={viewIndex} subscriptionId={subscription?.topic}>
      <Box tabIndex={-1} onMouseEnter={disableGlobalScroll} onMouseLeave={enableGlobalScroll}>
        <ViewContainer $viewIndex={viewIndex}>
          <OnBoardingView isReady={isSubscribed} isRegistered={isRegistered} />

          <NotificationView toggleSettings={toggleSettings} subscription={subscription} />

          <NotificationSettings toggleSettings={toggleSettings} />
        </ViewContainer>
      </Box>
    </NotificationMenu>
  )
})

export default Notifications
