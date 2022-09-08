/* eslint-disable jsx-a11y/anchor-is-valid */
import { ContextApi, languageList, useTranslation } from '@pancakeswap/localization'
import { DropdownMenuItems, Menu as UIMenu, MenuItemsType, SwapFillIcon, SwapIcon } from '@pancakeswap/uikit'
import orderBy from 'lodash/orderBy'
import { useTheme } from 'next-themes'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode, useMemo } from 'react'
import { footerLinks } from './footerConfig'
import UserMenu from './UserMenu'

export type ConfigMenuDropDownItemsType = DropdownMenuItems & { hideSubNav?: boolean }

export type ConfigMenuItemsType = Omit<MenuItemsType, 'items'> & { hideSubNav?: boolean; image?: string } & {
  items?: ConfigMenuDropDownItemsType[]
}

const config: (t: ContextApi['t']) => ConfigMenuItemsType[] = (t) => [
  {
    label: t('Swap'),
    icon: SwapIcon,
    fillIcon: SwapFillIcon,
    href: '/',
    showItemsOnMobile: false,
    items: [
      // {
      //   label: t('Swap'),
      //   href: '/swap',
      // },
      // {
      //   label: t('Liquidity'),
      //   href: '/liquidity',
      // },
    ],
  },
]

export const getActiveMenuItem = ({ pathname, menuConfig }: { pathname: string; menuConfig: ConfigMenuItemsType[] }) =>
  menuConfig.find((menuItem) => pathname.startsWith(menuItem.href) || getActiveSubMenuItem({ menuItem, pathname }))

export const getActiveSubMenuItem = ({ pathname, menuItem }: { pathname: string; menuItem?: ConfigMenuItemsType }) => {
  const activeSubMenuItems = menuItem?.items?.filter((subMenuItem) => pathname.startsWith(subMenuItem.href)) ?? []

  // Pathname doesn't include any submenu item href - return undefined
  if (!activeSubMenuItems || activeSubMenuItems.length === 0) {
    return undefined
  }

  // Pathname includes one sub menu item href - return it
  if (activeSubMenuItems.length === 1) {
    return activeSubMenuItems[0]
  }

  // Pathname includes multiple sub menu item hrefs - find the most specific match
  const mostSpecificMatch = orderBy(activeSubMenuItems, (subMenuItem) => subMenuItem.href.length, 'desc')[0]

  return mostSpecificMatch
}

export const Menu = ({ children }: { children: ReactNode }) => {
  const { currentLanguage, setLanguage, t } = useTranslation()

  const menuItems = config(t)
  const { pathname } = useRouter()
  const activeMenuItem = getActiveMenuItem({ menuConfig: menuItems, pathname })
  const activeSubMenuItem = getActiveSubMenuItem({ menuItem: activeMenuItem, pathname })
  const { setTheme, resolvedTheme } = useTheme()

  const isDark = resolvedTheme === 'dark'

  const toggleTheme = useMemo(() => {
    return () => setTheme(isDark ? 'light' : 'dark')
  }, [setTheme, isDark])

  const getFooterLinks = useMemo(() => {
    return footerLinks(t)
  }, [t])

  return (
    <UIMenu
      linkComponent={({ children: linkChildren, className, ...linkProps }) => {
        return (
          <NextLink {...linkProps} prefetch={false} passHref>
            <a className={className}>{linkChildren}</a>
          </NextLink>
        )
      }}
      links={menuItems}
      activeItem={activeMenuItem?.href}
      isDark={isDark}
      rightSide={
        <>
          <UserMenu />
        </>
      }
      setLang={setLanguage}
      footerLinks={getFooterLinks}
      currentLang={currentLanguage.code}
      langs={languageList}
      subLinks={activeMenuItem?.hideSubNav || activeSubMenuItem?.hideSubNav ? [] : activeMenuItem?.items}
      activeSubItem={activeSubMenuItem?.href}
      toggleTheme={toggleTheme}
      buyCakeLabel={t('Buy CAKE')}
    >
      {children}
    </UIMenu>
  )
}
