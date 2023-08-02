import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Box, Flex, Button, UserMenuProps, NotificationBellIcon } from '@pancakeswap/uikit'

const Menu = styled.div<{ isOpen: boolean }>`
  background-color: ${({ theme }) => theme.card.background};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 24px;
  padding-bottom: 4px;
  pointer-events: auto;
  width: 390px;
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
  UserMenuProps & { isMenuOpen: boolean; setIsMenuOpen: Dispatch<SetStateAction<boolean>> }
> = ({ children, isMenuOpen, setIsMenuOpen }) => {
  const ref = useRef<HTMLDivElement>(null)

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
    <Flex alignItems="center" height="100%" ref={ref} >
      <Button
        variant="text"
        startIcon={<NotificationBellIcon color="textSubtle" width="24px" />}
        onClick={() => setIsMenuOpen(true)}
      />
      <Menu isOpen={isMenuOpen} style={{ top: '100%', left: '63%', position: 'fixed' }}>
        <Box>{children?.({ isOpen: isMenuOpen })}</Box>
      </Menu>
    </Flex>
  )
}

export default NotificationMenu
