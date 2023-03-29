import { useMemo } from 'react'
import { Box, SubMenuItems } from '@pancakeswap/uikit'
// import { Box, SubMenuItems, DropdownMenuItemType } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useRouter } from 'next/router'
import useAuthAffiliateExist from 'views/AffiliatesProgram/hooks/useAuthAffiliateExist'

const AffiliatesProgramLayout = ({ children }) => {
  const { t } = useTranslation()
  const { pathname } = useRouter()
  const { isAffiliateExist } = useAuthAffiliateExist()

  const subMenuItems = useMemo(() => {
    const menu = [
      {
        label: t('Overview'),
        href: '/affiliates-program',
      },
      // {
      //   label: t('Application'),
      //   href: 'https://docs.google.com/forms/d/e/1FAIpQLSfP43IciQ5cH0JhTf1fDgUpwapBx-yD3ybv24pBdiVW7Th5jQ/viewform',
      //   type: DropdownMenuItemType.EXTERNAL_LINK,
      // },
    ]

    if (isAffiliateExist) {
      menu.push({
        label: t('Dashboard'),
        href: '/affiliates-program/dashboard',
      })
    }

    return menu
  }, [t, isAffiliateExist])

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
