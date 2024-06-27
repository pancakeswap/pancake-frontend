import { Trans } from '@pancakeswap/localization'
import { Flex } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'
import { styled } from 'styled-components'

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

export enum ProfileUrlType {
  HOME_PAGE = '/profile',
  NFT = '/profile#nft',
  ACHIEVEMENT = '/profile#achievements',
}

export const list = [
  {
    title: <Trans>Quests</Trans>,
    url: ProfileUrlType.HOME_PAGE,
  },
  {
    title: <Trans>NFTs</Trans>,
    url: ProfileUrlType.NFT,
  },
  {
    title: <Trans>Achievements</Trans>,
    url: ProfileUrlType.ACHIEVEMENT,
  },
]

const TabMenu = () => {
  const { asPath } = useRouter()

  return (
    <Flex>
      {list.map((menu) => (
        <Tab key={menu.url} $active={menu.url === asPath} as={NextLinkFromReactRouter} to={menu.url}>
          {menu.title}
        </Tab>
      ))}
    </Flex>
  )
}

export default TabMenu
