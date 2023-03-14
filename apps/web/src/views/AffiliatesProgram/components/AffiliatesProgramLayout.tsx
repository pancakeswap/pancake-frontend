import { useMemo } from 'react'
import { Box, SubMenuItems, DropdownMenuItemType } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useRouter } from 'next/router'

const AffiliatesProgramLayout = ({ children }) => {
  const { t } = useTranslation()
  const { pathname } = useRouter()

  const subMenuItems = useMemo(() => {
    return [
      {
        label: t('Overview'),
        href: '/affiliates-program',
      },
      {
        label: t('Application'),
        href: 'https://docs.pancakeswap.finance/ambassador-program',
        type: DropdownMenuItemType.EXTERNAL_LINK,
      },
      {
        label: t('Dashboard'),
        href: '/affiliates-program/dashboard',
      },
    ]
  }, [t])

  const activeSubItem = useMemo(() => {
    return subMenuItems.find((subMenuItem) => subMenuItem.href === pathname)?.href
  }, [subMenuItems, pathname])

  return (
    <Box>
      <SubMenuItems items={subMenuItems} activeItem={activeSubItem} />
      {children}
    </Box>
  )
}

export default AffiliatesProgramLayout
