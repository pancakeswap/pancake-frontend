import { useMemo } from 'react'
import { useRouter } from 'next/router'
import { SubMenuItems, Box } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

export const GamePageLayout = ({ children }) => {
  const { t } = useTranslation()
  const { query, pathname } = useRouter()

  const subMenuItems = useMemo(
    () => [
      {
        label: t('Game'),
        href: '/game',
      },
      {
        label: t('Developers'),
        href: '/game/developers',
      },
      {
        label: t('Community'),
        href: '/game/community',
      },
    ],
    [t],
  )

  const activeSubItem = useMemo(() => {
    // /game/project/${projectId}
    if (query.projectId) {
      return `/game`
    }

    return subMenuItems.find((subMenuItem) => subMenuItem.href === pathname)?.href
  }, [query, subMenuItems, pathname])

  return (
    <Box>
      <SubMenuItems items={subMenuItems} activeItem={activeSubItem} />
      {children}
    </Box>
  )
}
