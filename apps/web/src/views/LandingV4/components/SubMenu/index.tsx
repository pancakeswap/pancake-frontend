import { useTranslation } from '@pancakeswap/localization'
import { SubMenuItems } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'

export const SubMenu: React.FC<React.PropsWithChildren> = () => {
  const { pathname } = useRouter()
  const { t } = useTranslation()

  const subMenuItems = useMemo(() => {
    return [
      { label: t('Introducing v4'), href: '/introducing-v4#banner' },
      { label: t('Features'), href: '/introducing-v4#features' },
      { label: t('Start Building'), href: '/introducing-v4#building' },
      { label: t('Hooks'), href: '/introducing-v4#hooks' },
      { label: t('Events and News'), href: '/introducing-v4#events' },
    ]
  }, [t])

  const activeSubItem = useMemo(() => {
    return subMenuItems.find((subMenuItem) => subMenuItem.href === pathname)?.href
  }, [subMenuItems, pathname])

  return <SubMenuItems items={subMenuItems} activeItem={activeSubItem} />
}
