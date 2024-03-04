import {
  NotificationBell as BellIcon,
  Box,
  Flex,
  ModalV2,
  ModalWrapper,
  UserMenuProps,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { useMessages } from '@web3inbox/widget-react'
import React, { Dispatch, SetStateAction, useCallback, useEffect, useRef } from 'react'
import { setHasUnread } from 'state/notifications/actions'
import { useHasUnreadNotifications } from 'state/notifications/hooks'
import useSendPushNotification from 'views/Notifications/hooks/sendPushNotification'
import { BellIconContainer, Menu } from 'views/Notifications/styles'
import { PAGE_VIEW } from 'views/Notifications/types'
import { useNotificationsState } from 'state/notifications/reducer'

interface InotificationBellProps {
  unread: boolean
  toggleMenu: () => void
}

const NotificationBell = ({ unread, toggleMenu }: InotificationBellProps) => {
  return (
    <BellIconContainer onClick={toggleMenu}>
      <BellIcon height={24} width={24} color="textSubtle" />
      {unread ? <div className="notification-badge">{unread}</div> : null}
    </BellIconContainer>
  )
}

const NotificationMenu: React.FC<
  UserMenuProps & {
    isMenuOpen: boolean
    setIsMenuOpen: Dispatch<SetStateAction<boolean>>
    viewIndex: PAGE_VIEW
    subscriptionId: string | undefined
    account: string | undefined
  }
> = ({ children, isMenuOpen, setIsMenuOpen, viewIndex, subscriptionId, account }) => {
  const hasUnread = useHasUnreadNotifications(subscriptionId)
  const [, dispatch] = useNotificationsState()
  const { messages: notifications } = useMessages(account)
  const { requestNotificationPermission } = useSendPushNotification()

  const ref = useRef<HTMLDivElement>(null)
  const { isMobile } = useMatchBreakpoints()

  const markAllNotificationsAsRead = useCallback(() => {
    if (!subscriptionId) return
    for (const unreadNotification of notifications) {
      dispatch(setHasUnread({ subscriptionId, notificationId: unreadNotification.id, hasUnread: true }))
    }
  }, [dispatch, notifications, subscriptionId])

  const toggleMenu = useCallback(() => {
    if (!isMenuOpen) {
      requestNotificationPermission()
      markAllNotificationsAsRead()
    }
    setIsMenuOpen(!isMenuOpen)
  }, [setIsMenuOpen, isMenuOpen, markAllNotificationsAsRead, requestNotificationPermission])

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('click', checkIfClickedOutside)
    return () => document.removeEventListener('click', checkIfClickedOutside)
  }, [isMenuOpen, setIsMenuOpen])

  if (isMobile) {
    return (
      <Flex alignItems="center" justifyContent="center" tabIndex={-1}>
        <NotificationBell unread={hasUnread} toggleMenu={toggleMenu} />
        <ModalV2 isOpen={isMenuOpen} onDismiss={toggleMenu} closeOnOverlayClick>
          <ModalWrapper onDismiss={toggleMenu} height="100vh" minWidth="320px">
            {children?.({ isOpen: isMenuOpen })}
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
        <Box>{children?.({ isOpen: isMenuOpen })}</Box>
      </Menu>
    </Flex>
  )
}

export default NotificationMenu
