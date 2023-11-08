import { Box, Flex, ModalV2, ModalWrapper, UserMenuProps, useMatchBreakpoints } from '@pancakeswap/uikit'
import Image from 'next/image'
import React, { Dispatch, SetStateAction, useCallback, useEffect, useRef } from 'react'
import { BellIconContainer, Menu } from 'views/Notifications/styles'
import { PAGE_VIEW } from 'views/Notifications/types'
import useUnreadNotifications from '../../hooks/useUnreadNotifications'

interface InotificationBellProps {
  unread: number
  toggleMenu: () => void
}

const NotificationBell = ({ unread, toggleMenu }: InotificationBellProps) => {
  return (
    <BellIconContainer onClick={toggleMenu}>
      <Image src="/images/notifications/notifications.svg" alt="notifications" width={26} height={26} />
      {unread > 0 ? <div className="notification-badge">{unread}</div> : null}
    </BellIconContainer>
  )
}

const NotificationMenu: React.FC<
  UserMenuProps & {
    isMenuOpen: boolean
    setIsMenuOpen: Dispatch<SetStateAction<boolean>>
    isRegistered: boolean
    handleRegistration: () => Promise<void>
    viewIndex: PAGE_VIEW
  }
> = ({ children, isMenuOpen, setIsMenuOpen, isRegistered, handleRegistration, viewIndex }) => {
  const { unread, setUnread } = useUnreadNotifications()

  const ref = useRef<HTMLDivElement>(null)
  const { isMobile } = useMatchBreakpoints()

  const toggleMenu = useCallback(() => {
    if (isRegistered) handleRegistration()
    setUnread(0)
    localStorage.setItem('unread', '0')
    setIsMenuOpen(!isMenuOpen)
  }, [setIsMenuOpen, isMenuOpen, setUnread, isRegistered, handleRegistration])

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
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
      <Flex alignItems="center" justifyContent="center" height="100%" tabIndex={-1}>
        <NotificationBell unread={unread} toggleMenu={toggleMenu} />
        <ModalV2 isOpen={isMenuOpen} onDismiss={toggleMenu} closeOnOverlayClick>
          <ModalWrapper minWidth="320px">{children?.({ isOpen: isMenuOpen })}</ModalWrapper>
        </ModalV2>
      </Flex>
    )
  }
  return (
    <Flex alignItems="center" justifyContent="center" height="100%" ref={ref} tabIndex={-1}>
      <NotificationBell unread={unread} toggleMenu={toggleMenu} />
      <Menu
        isOpen={isMenuOpen}
        style={{ top: '100%', position: 'fixed' }}
        overrideHeight={viewIndex === PAGE_VIEW.OnboardView}
      >
        <Box>{children?.({ isOpen: isMenuOpen })}</Box>
      </Menu>
    </Flex>
  )
}

export default NotificationMenu
