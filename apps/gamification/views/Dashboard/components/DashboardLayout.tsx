import { useTranslation } from '@pancakeswap/localization'
import { Box } from '@pancakeswap/uikit'
// import { Box, SubMenuItems } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { useIsValidDashboardUser } from 'views/Dashboard/hooks/useIsValidDashboardUser'
import { useAccount } from 'wagmi'

export const DashboardLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation()
  const { pathname, replace } = useRouter()
  const { address: account } = useAccount()
  const { isValidLoginToDashboard, isFetched } = useIsValidDashboardUser()

  useEffect(() => {
    if (isFetched && !isValidLoginToDashboard) {
      replace('/')
    }
  }, [isFetched, isValidLoginToDashboard, replace])

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

  const activeSubItem = useMemo(() => {
    if (pathname.includes('/dashboard/campaign')) {
      return '/dashboard/campaign'
    }

    return '/dashboard'
  }, [pathname])

  if (!isFetched || !isValidLoginToDashboard || !account) {
    return null
  }

  return (
    <Box>
      {/* <SubMenuItems items={subMenuItems} activeItem={activeSubItem} /> */}
      {children}
    </Box>
  )
}
