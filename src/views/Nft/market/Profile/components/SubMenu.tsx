import React from 'react'
import { SubMenuItems } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useLocation } from 'react-router'
import styled from 'styled-components'
import { nftsBaseUrl } from 'views/Nft/market/constants'

const StyledSubMenuItems = styled(SubMenuItems)`
  background-color: ${({ theme }) => theme.colors.background};
  justify-content: flex-start;
  border-bottom: 1px ${({ theme }) => theme.colors.cardBorder} solid;
  margin-bottom: 60px;
`

const SubMenuComponent: React.FC = () => {
  const { t } = useTranslation()
  const { pathname } = useLocation()

  const ItemsConfig = [
    {
      label: t('Items'),
      href: `${nftsBaseUrl}/profile`,
    },
    {
      label: t('Activity'),
      href: `${nftsBaseUrl}/profile/activity`,
    },
  ]

  return <StyledSubMenuItems items={ItemsConfig} activeItem={pathname} />
}

export default SubMenuComponent
