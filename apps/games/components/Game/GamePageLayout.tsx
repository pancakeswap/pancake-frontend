import { useMemo } from 'react'
import { useRouter } from 'next/router'
import { SubMenuItems, Box, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

interface GamePageLayoutProps {
  children: React.ReactNode
}

export const GamePageLayout: React.FC<React.PropsWithChildren<GamePageLayoutProps>> = ({ children }) => {
  const { t } = useTranslation()
  const { query, pathname } = useRouter()
  const { isDesktop } = useMatchBreakpoints()

  const subMenuItems = useMemo(
    () => [
      {
        label: t('Games'),
        href: '/',
      },
      {
        label: t('Developers'),
        href: '/developers',
      },
      {
        label: t('Community'),
        href: '/community',
      },
    ],
    [t],
  )

  const activeSubItem = useMemo(() => {
    // /project/${projectId}
    if (query.projectId) {
      return `/`
    }

    return subMenuItems.find((subMenuItem) => subMenuItem.href === pathname)?.href
  }, [query, subMenuItems, pathname])

  return (
    <Box>
      {!isDesktop && <SubMenuItems items={subMenuItems} activeItem={activeSubItem} />}
      {children}
    </Box>
  )
}
