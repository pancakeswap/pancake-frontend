import React from 'react'
import { useTranslation } from 'contexts/Localization'
import { useRouter } from 'next/router'
import BaseSubMenu from '../../components/BaseSubMenu'
import { nftsBaseUrl } from '../../constants'

const SubMenuComponent: React.FC = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const accountAddress = router.query.accountAddress as string
  const { pathname } = router

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
