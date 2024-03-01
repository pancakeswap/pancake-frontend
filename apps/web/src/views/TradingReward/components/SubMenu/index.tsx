import { useTranslation } from '@pancakeswap/localization'
import { SubMenuItems } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'

const SubMenu: React.FC<React.PropsWithChildren> = () => {
  const { pathname } = useRouter()
  const { t } = useTranslation()

  const subMenuItems = useMemo(() => {
    return [
      { label: t('CAKE Stakers'), href: '/trading-reward/cake-stakers' },
      { label: t('Top Traders'), href: '/trading-reward/top-traders' },
    ]
  }, [t])

  const activeSubItem = useMemo(() => {
    return subMenuItems.find((subMenuItem) => subMenuItem.href === pathname)?.href
  }, [subMenuItems, pathname])

  return <SubMenuItems items={subMenuItems} activeItem={activeSubItem} />
}

export default SubMenu
