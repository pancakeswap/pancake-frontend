import { useTranslation } from 'contexts/Localization'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { ChevronLeftIcon, Flex, Text, ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'

interface MenuProps {
  activeIndex?: number
}

const Menu: React.FC<MenuProps> = ({ activeIndex = 0 }) => {
  const { t } = useTranslation()

  return (
    <>
      <Flex mb="24px">
        <RouterLink to="/teams">
          <Flex alignItems="center">
            <ChevronLeftIcon color="primary" />
            <Text color="primary">{t('Teams Overview')}</Text>
          </Flex>
        </RouterLink>
      </Flex>

      <Flex mb="24px" justifyContent="center">
        <ButtonMenu activeIndex={activeIndex} variant="subtle" scale="sm">
          <ButtonMenuItem as={RouterLink} to="/profile/tasks">
            {t('Task Center')}
          </ButtonMenuItem>
          <ButtonMenuItem as={RouterLink} to="/profile">
            {t('Public Profile')}
          </ButtonMenuItem>
        </ButtonMenu>
      </Flex>
    </>
  )
}

export default Menu
