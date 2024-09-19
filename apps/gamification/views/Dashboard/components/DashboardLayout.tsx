import { Box } from '@pancakeswap/uikit'
// import { Box, SubMenuItems } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useIsValidDashboardUser } from 'views/Dashboard/hooks/useIsValidDashboardUser'
import { useAccount } from 'wagmi'

export const DashboardLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { replace } = useRouter()
  const { address: account } = useAccount()
  const { isValidLoginToDashboard, isFetched } = useIsValidDashboardUser()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!account) {
        replace('/')
      }
    }, 10)

    if (isFetched && !isValidLoginToDashboard) {
      replace('/')
    }

    return () => {
      clearTimeout(timer)
    }
  }, [account, isFetched, isValidLoginToDashboard, replace])

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
