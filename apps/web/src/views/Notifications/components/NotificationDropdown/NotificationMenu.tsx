import { Box, Flex, NotificationBellIcon, UserMenuProps } from '@pancakeswap/uikit'
import { useWalletConnectPushClient } from 'contexts/PushClientContext'
import React, { Dispatch, SetStateAction, useCallback, useEffect, useRef } from 'react'
import { BellIconContainer, Menu } from 'views/Notifications/styles'

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
  const { unread, setUnread } = useWalletConnectPushClient()
  const ref = useRef<HTMLDivElement>(null)

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(true)
    setUnread(0)
  }, [setIsMenuOpen, setUnread])

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node | null)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('click', checkIfClickedOutside)
    return () => document.removeEventListener('click', checkIfClickedOutside)
  }, [isMenuOpen, setIsMenuOpen])

  return (
    <Flex alignItems="center" height="100%" ref={ref}>
      <NotificationBell unread={unread} toggleMenu={toggleMenu} />
      <Menu isOpen={isMenuOpen} style={{ top: '100%', left: '63%', position: 'fixed' }}>
        <Box>{children?.({ isOpen: isMenuOpen })}</Box>
      </Menu>
    </Flex>
  )
}

export default NotificationMenu
