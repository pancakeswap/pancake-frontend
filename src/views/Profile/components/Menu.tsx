import useI18n from 'hooks/useI18n'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { ChevronLeftIcon, Flex, Text, ButtonMenu, ButtonMenuItem } from '@pancakeswap-libs/uikit'

interface MenuProps {
  activeIndex?: number
}

const Menu: React.FC<MenuProps> = ({ activeIndex = 0 }) => {
  const TranslateString = useI18n()

  return (
    <>
      <Flex mb="24px">
        <RouterLink to="/teams">
          <Flex alignItems="center">
            <ChevronLeftIcon color="primary" />
            <Text color="primary">{TranslateString(1038, 'Teams Overview')}</Text>
          </Flex>
        </RouterLink>
      </Flex>

      <Flex mb="24px" justifyContent="center">
        <ButtonMenu activeIndex={activeIndex} variant="subtle" scale="sm">
          <ButtonMenuItem as={RouterLink} to="/profile/tasks">
            {TranslateString(1090, 'Task Center')}
          </ButtonMenuItem>
          <ButtonMenuItem as={RouterLink} to="/profile">
            {TranslateString(1104, 'Public Profile')}
          </ButtonMenuItem>
        </ButtonMenu>
      </Flex>
    </>
  )
}

export default Menu
