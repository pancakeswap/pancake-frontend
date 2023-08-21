import { Box, Flex, ModalV2, ModalWrapper, NotificationBellIcon, UserMenuProps } from '@pancakeswap/uikit'
import { usePushClient } from 'contexts/PushClientContext'
import React, { Dispatch, SetStateAction, useCallback, useEffect, useRef } from 'react'
import { BellIconContainer, Menu } from 'views/Notifications/styles'
import { useViewport } from '../hooks/useViewPort'

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
  }
> = ({ children, isMenuOpen, setIsMenuOpen }) => {
  const { unread, setUnread, refreshNotifications } = usePushClient()
  const ref = useRef<HTMLDivElement>(null)
  const { width } = useViewport()

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(!isMenuOpen)
    if (!isMenuOpen) setUnread(0)
  }, [setIsMenuOpen, setUnread, isMenuOpen])

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node | null)) {
        setIsMenuOpen(false)
      }
    }
    refreshNotifications()
    document.addEventListener('click', checkIfClickedOutside)
    return () => document.removeEventListener('click', checkIfClickedOutside)
  }, [isMenuOpen, setIsMenuOpen, refreshNotifications])

  if (width <= 650) {
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
