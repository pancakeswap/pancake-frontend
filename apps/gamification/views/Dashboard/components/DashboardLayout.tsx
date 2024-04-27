import { useTranslation } from '@pancakeswap/localization'
import { Box, SubMenuItems } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

export const DashboardLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation()
  const { pathname } = useRouter()

  const subMenuItems = useMemo(() => {
    const menu = [
      {
        label: t('Quests'),
        href: '/dashboard',
      },
      {
        label: t('Campaigns'),
        href: '/dashboard/campaign',
      },
    ]

    return menu
  }, [t])

  const activeSubItem = useMemo(
    () => subMenuItems.find((subMenuItem) => subMenuItem.href === pathname)?.href,
    [subMenuItems, pathname],
  )

  return (
    <Box>
      <SubMenuItems items={subMenuItems} activeItem={activeSubItem} />
      {children}
    </Box>
  )
}
