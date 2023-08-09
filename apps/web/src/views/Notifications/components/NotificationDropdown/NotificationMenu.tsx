import { Box, Flex, NotificationBellIcon, UserMenuProps } from '@pancakeswap/uikit'
import { useWalletConnectPushClient } from 'contexts/PushClientContext'
import React, { Dispatch, SetStateAction, useCallback, useEffect, useRef } from 'react'
import styled from 'styled-components'

const Menu = styled.div<{ isOpen: boolean }>`
  background-color: ${({ theme }) => theme.card.background};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 24px;
  padding-bottom: 4px;
  pointer-events: auto;
  width: 400px;
  overflow: hidden;
  position: relative;
  visibility: visible;
  z-index: 1001;

  ${({ isOpen }) =>
    !isOpen &&
    `
    pointer-events: none;
    visibility: hidden;
  `}
`

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
    const checkIfClickedOutside = (e: Event) => {
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node | null)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('click', checkIfClickedOutside)
    return () => {
      document.removeEventListener('click', checkIfClickedOutside)
    }
  }, [isMenuOpen, setIsMenuOpen])

  return (
    <Flex alignItems="center" height="100%" ref={ref}>
      <Box position="relative" paddingRight="16px" paddingLeft="8px" onClick={toggleMenu}>
        <NotificationBellIcon color="textSubtle" width="30px" />
        {unread > 0 ? (
          <div
            style={{
              position: 'absolute',
              bottom: '60%',
              left: '45%',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'red',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            {unread}
          </div>
        ) : null}
      </Box>
      <Menu isOpen={isMenuOpen} style={{ top: '100%', left: '63%', position: 'fixed' }}>
        <Box>{children?.({ isOpen: isMenuOpen })}</Box>
      </Menu>
    </Flex>
  )
}

export default NotificationMenu
