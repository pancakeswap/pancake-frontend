import React from 'react'
import { useTranslation } from 'contexts/Localization'
import { useLocation } from 'react-router'
import BaseSubMenu from '../../components/BaseSubMenu'

const SubMenuComponent: React.FC = () => {
  const { t } = useTranslation()
  const { pathname } = useLocation()

  const ItemsConfig = [
    {
      label: t('Items'),
      href: '/nft/market/profile',
    },
    {
      label: t('Activity'),
      href: '/nft/market/profile/activity',
    },
  ]

  return <BaseSubMenu items={ItemsConfig} activeItem={pathname} justifyContent="flex-start" mb="60px" />
}

export default SubMenuComponent
