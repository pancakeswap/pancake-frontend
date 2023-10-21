import {
  Box,
  Flex,
  ModalV2,
  ModalWrapper,
  NotificationBellIcon,
  UserMenuProps,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import React, { Dispatch, SetStateAction, useCallback, useEffect, useRef } from 'react'
import { BellIconContainer, Menu } from 'views/Notifications/styles'
import useUnreadNotifications from '../hooks/useUnreadNotifications'

interface InotificationBellProps {
  unread: number
  toggleMenu: () => void
}

const NotificationBell = ({ unread, toggleMenu }: InotificationBellProps) => {
  return (
    <BellIconContainer onClick={toggleMenu}>
      <NotificationBellIcon />
      {unread > 0 ? <div className="notification-badge">{unread}</div> : null}
    </BellIconContainer>
  )
}

const NotificationMenu: React.FC<
  UserMenuProps & {
    isMenuOpen: boolean
    setIsMenuOpen: Dispatch<SetStateAction<boolean>>
    identityKey: string | undefined
    isSubscribed: boolean
    handleRegistration: () => Promise<void>
  }
> = ({ children, isMenuOpen, setIsMenuOpen, identityKey, handleRegistration, isSubscribed }) => {
  const { unread, setUnread } = useUnreadNotifications()

  const ref = useRef<HTMLDivElement>(null)
  const { isMobile } = useMatchBreakpoints()

  const toggleMenu = useCallback(() => {
    if (!identityKey && isSubscribed) handleRegistration()
    setUnread(0)
    localStorage.setItem('unread', '0')
    setIsMenuOpen(!isMenuOpen)
  }, [setIsMenuOpen, isMenuOpen, setUnread, identityKey, handleRegistration, isSubscribed])

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node | null)) {
        setIsMenuOpen(false)
        localStorage.setItem('unread', '0')
        setUnread(0)
      }
    }
    document.addEventListener('click', checkIfClickedOutside)
    return () => document.removeEventListener('click', checkIfClickedOutside)
  }, [isMenuOpen, setIsMenuOpen, setUnread])

  if (isMobile) {
    return (
      <Flex alignItems="center" justifyContent="center" height="100%">
        <NotificationBell unread={unread} toggleMenu={toggleMenu} />
        <ModalV2 isOpen={isMenuOpen} onDismiss={toggleMenu} closeOnOverlayClick>
          <ModalWrapper minWidth="320px">{children?.({ isOpen: isMenuOpen })}</ModalWrapper>
        </ModalV2>
      </Flex>
    )
  }
  return (
    <Flex alignItems="center" justifyContent="center" height="100%" ref={ref}>
      <NotificationBell unread={unread} toggleMenu={toggleMenu} />
      <Menu isOpen={isMenuOpen} style={{ top: '100%', position: 'fixed' }}>
        <Box>{children?.({ isOpen: isMenuOpen })}</Box>
      </Menu>
    </Flex>
  )
}

export default NotificationMenu
