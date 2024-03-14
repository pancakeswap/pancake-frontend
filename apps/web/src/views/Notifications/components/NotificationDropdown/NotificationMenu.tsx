import { NotificationBell as BellIcon, Box, Flex, ModalV2, ModalWrapper, useMatchBreakpoints } from '@pancakeswap/uikit'
// import { useNotifications } from '@web3inbox/react'
import React, { ReactNode, memo, useCallback, useEffect, useRef, useState } from 'react'
import useSendPushNotification from 'views/Notifications/hooks/sendPushNotification'
import useNotificationHistory from 'views/Notifications/hooks/useNotificationHistory'
import { BellIconContainer, Menu } from 'views/Notifications/styles'
import { PAGE_VIEW } from 'views/Notifications/types'

interface InotificationBellProps {
  unread: number
  toggleMenu: () => void
}

const NotificationBell = ({ unread, toggleMenu }: InotificationBellProps) => {
  const unreadDisplay = unread >= 9 ? '9+' : `${unread}`
  return (
    <BellIconContainer onClick={toggleMenu}>
      <BellIcon height={24} width={24} color="textSubtle" />
      {unread > 0 ? <div className="notification-badge">{unreadDisplay}</div> : null}
    </BellIconContainer>
  )
}

const NotificationMenu: React.FC<{
  viewIndex: PAGE_VIEW
  subscriptionId: string | undefined
  children: ReactNode
}> = ({ children, viewIndex, subscriptionId }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const ref = useRef<HTMLDivElement>(null)
  const { isMobile } = useMatchBreakpoints()

  const { hasUnread, markAllNotificationsAsRead } = useNotificationHistory(subscriptionId)
  const { requestNotificationPermission } = useSendPushNotification()

  const toggleMenu = useCallback(() => {
    if (!isMenuOpen) requestNotificationPermission()
    setIsMenuOpen(!isMenuOpen)
  }, [setIsMenuOpen, isMenuOpen, requestNotificationPermission])

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        markAllNotificationsAsRead()
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('click', checkIfClickedOutside)
    return () => document.removeEventListener('click', checkIfClickedOutside)
  }, [isMenuOpen, setIsMenuOpen, markAllNotificationsAsRead])

  if (isMobile) {
    return (
      <Flex alignItems="center" justifyContent="center" tabIndex={-1}>
        <NotificationBell unread={hasUnread} toggleMenu={toggleMenu} />
        <ModalV2 isOpen={isMenuOpen} onDismiss={toggleMenu} closeOnOverlayClick>
          <ModalWrapper onDismiss={toggleMenu} minWidth="320px" height="90vh">
            {children}
          </ModalWrapper>
        </ModalV2>
      </Flex>
    )
  }
  return (
    <Flex alignItems="center" justifyContent="center" height="100%" ref={ref} tabIndex={-1}>
      <NotificationBell unread={hasUnread} toggleMenu={toggleMenu} />
      <Menu
        $isOpen={isMenuOpen}
        style={{ top: '100%', position: 'fixed' }}
        $overrideHeight={viewIndex === PAGE_VIEW.OnboardView}
      >
        <Box>{children}</Box>
      </Menu>
    </Flex>
  )
}

export default memo(NotificationMenu)
