import { ButtonMenu, ButtonMenuItem, Flex } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import React from 'react'
import { Link } from 'react-router-dom'

interface MenuProps {
  activeIndex?: number
}

const Menu: React.FC<MenuProps> = ({ activeIndex = 0 }) => {
  const TranslateString = useI18n()

  return (
    <Flex mb="24px" justifyContent="center">
      <ButtonMenu activeIndex={activeIndex} variant="subtle" size="sm">
        <ButtonMenuItem as={Link} to="/profile">
          {TranslateString(999, 'Public Profile')}
        </ButtonMenuItem>
        <ButtonMenuItem as={Link} to="/profile/tasks">
          {TranslateString(999, 'Task Center')}
        </ButtonMenuItem>
      </ButtonMenu>
    </Flex>
  )
}

export default Menu
