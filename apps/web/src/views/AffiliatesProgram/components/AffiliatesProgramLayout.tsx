import { useMemo } from 'react'
import { Box, SubMenuItems, DropdownMenuItemType } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useRouter } from 'next/router'

const AffiliatesProgramLayout = ({ children }) => {
  const { t } = useTranslation()
  const { pathname } = useRouter()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const menu = [
    {
      label: t('Overview'),
      href: '/affiliates-program',
    },
    {
      label: t('Application'),
      href: 'https://docs.google.com/forms/d/e/1FAIpQLSfP43IciQ5cH0JhTf1fDgUpwapBx-yD3ybv24pBdiVW7Th5jQ/viewform',
      type: DropdownMenuItemType.EXTERNAL_LINK,
    },
    {
      label: t('Dashboard'),
      href: '/affiliates-program/dashboard',
    },
    {
      label: t('Leaderboard'),
      href: '/affiliates-program/leaderboard',
    },
  ]

  const activeSubItem = useMemo(() => menu.find((subMenuItem) => subMenuItem.href === pathname)?.href, [menu, pathname])

  return (
    <Box>
      <SubMenuItems items={menu} activeItem={activeSubItem} />
      {children}
    </Box>
  )
}

export default AffiliatesProgramLayout
