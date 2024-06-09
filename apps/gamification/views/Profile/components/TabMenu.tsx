import { useState, useEffect } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { styled } from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'

import { useRouter } from 'next/router'

const Tab = styled.button<{ $active: boolean }>`
  display: inline-flex;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme, $active }) => ($active ? theme.colors.secondary : theme.colors.textSubtle)};
  border-width: ${({ $active }) => ($active ? '1px 1px 0 1px' : '0')};
  border-style: solid solid none solid;
  border-color: ${({ theme }) =>
    `${theme.colors.cardBorder} ${theme.colors.cardBorder} transparent ${theme.colors.cardBorder}`};
  outline: 0;
  padding: 12px 16px;
  border-radius: 16px 16px 0 0;
  font-size: 16px;
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  background-color: ${({ theme, $active }) => ($active ? theme.colors.background : 'transparent')};
  transition: background-color 0.3s ease-out;
`

const TabMenu = () => {
  const { t } = useTranslation()
  const { pathname, query } = useRouter()
  const { accountAddress } = query
  const [achievementsActive, setIsAchievementsActive] = useState(pathname.includes('achievements'))

  useEffect(() => {
    setIsAchievementsActive(pathname.includes('achievements'))
  }, [pathname])

  return (
    <Flex>
      <Tab
        onClick={() => setIsAchievementsActive(false)}
        $active={!achievementsActive}
        as={NextLinkFromReactRouter}
        to={`/profile/${accountAddress}`}
      >
        NFTs
      </Tab>
      <Tab
        onClick={() => setIsAchievementsActive(true)}
        $active={achievementsActive}
        as={NextLinkFromReactRouter}
        to={`/profile/${accountAddress}/achievements`}
      >
        {t('Achievements')}
      </Tab>
    </Flex>
  )
}

export default TabMenu
