import { useTranslation } from '@pancakeswap/localization'
import { Box, SubMenuItems } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { useIsValidDashboardUser } from 'views/Dashboard/hooks/useIsValidDashboardUser'
import { useAccount } from 'wagmi'

export const DashboardLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation()
  const { pathname, push } = useRouter()
  const { address: account } = useAccount()
  const [isFirstTime, setIsFirstTime] = useState(true)
  const showDashboardNav = useIsValidDashboardUser()

  // useEffect(() => {
  //   const timer = setTimeout(() => setIsFirstTime(false), 1000)

  //   if (showDashboardNav === false || !isFirstTime) {
  //     push('/')
  //   }

  //   return () => clearTimeout(timer)
  // }, [isFirstTime, push, showDashboardNav])

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

  if (!showDashboardNav || (!isFirstTime && !account)) {
    return null
  }

  return (
    <Box>
      <SubMenuItems items={subMenuItems} activeItem={activeSubItem} />
      {children}
    </Box>
  )
}
