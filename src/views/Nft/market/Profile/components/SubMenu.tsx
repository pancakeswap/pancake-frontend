import React from 'react'
import { useTranslation } from 'contexts/Localization'
import { useLocation } from 'react-router'
import BaseSubMenu from '../../components/BaseSubMenu'
import { nftsBaseUrl } from '../../constants'

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

  return <BaseSubMenu items={ItemsConfig} activeItem={pathname} justifyContent="flex-start" mb="60px" />
}

export default SubMenuComponent
