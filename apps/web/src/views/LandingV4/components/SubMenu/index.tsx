import { useTranslation } from '@pancakeswap/localization'
import { SubMenuItems } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import { styled } from 'styled-components'

const SubMenuItemsStyled = styled(SubMenuItems)`
  > div > div ::after {
    display: none;
  }
`

export const SubMenu: React.FC<React.PropsWithChildren> = () => {
  const { asPath } = useRouter()
  const { t } = useTranslation()

  const subMenuItems = useMemo(() => {
    return [
      { label: t('Introducing v4'), href: '/v4' },
      { label: t('Features'), href: '/v4#features' },
      { label: t('Start Building'), href: '/v4#building' },
      { label: t('Hooks'), href: '/v4#hooks' },
      { label: t('Events and News'), href: '/v4#events' },
    ]
  }, [t])

  const activeSubItem = useMemo(() => {
    return subMenuItems.find((subMenuItem) => subMenuItem.href === asPath)?.href
  }, [subMenuItems, asPath])

  return <SubMenuItemsStyled items={subMenuItems} activeItem={activeSubItem} />
}
