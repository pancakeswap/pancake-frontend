import React from 'react'
import { useTranslation } from 'contexts/Localization'
import { useLocation, useParams } from 'react-router'
import BaseSubMenu from '../../components/BaseSubMenu'
import { nftsBaseUrl } from '../../constants'

const SubMenuComponent: React.FC = () => {
  const { t } = useTranslation()
  const { accountAddress } = useParams<{ accountAddress: string }>()
  const { pathname } = useLocation()

  const ItemsConfig = [
    {
      label: t('Items'),
      href: `${nftsBaseUrl}/profile/${accountAddress}`,
    },
    {
      label: t('Activity'),
      href: `${nftsBaseUrl}/profile/${accountAddress}/activity`,
    },
  ]

  return <BaseSubMenu items={ItemsConfig} activeItem={pathname} justifyContent="flex-start" mb="60px" />
}

export default SubMenuComponent
