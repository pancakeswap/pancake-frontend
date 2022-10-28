/* eslint-disable jsx-a11y/anchor-is-valid */
import { ContextApi, languageList, useTranslation } from '@pancakeswap/localization'
import {
  DropdownMenuItems,
  EarnFillIcon,
  EarnIcon,
  Menu as UIMenu,
  MenuItemsType,
  MoreIcon,
  NextLinkFromReactRouter,
  SwapFillIcon,
  SwapIcon,
} from '@pancakeswap/uikit'
import { NetworkSwitcher } from 'components/NetworkSwitcher'
import PhishingWarningBanner from 'components/PhishingWarningBanner'
import { useCakePrice } from 'hooks/useStablePrice'
import orderBy from 'lodash/orderBy'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/router'
import { ReactNode, useMemo } from 'react'
import { usePhishingBanner } from 'state/user'
import { footerLinks } from './footerConfig'
import { SettingsButton } from './Settings/SettingsButton'
import UserMenu from './UserMenu'

export type ConfigMenuDropDownItemsType = DropdownMenuItems & { hideSubNav?: boolean }

export type ConfigMenuItemsType = Omit<MenuItemsType, 'items'> & { hideSubNav?: boolean; image?: string } & {
  items?: ConfigMenuDropDownItemsType[]
}

const config: (t: ContextApi['t']) => ConfigMenuItemsType[] = (t) => [
  {
    label: t('Trade'),
    icon: SwapIcon,
    fillIcon: SwapFillIcon,
    href: '/swap',
    showItemsOnMobile: false,
    items: [
      {
        label: t('Swap'),
        href: '/swap',
      },
      {
        label: t('Liquidity'),
        href: '/liquidity',
      },
    ],
  },
  {
    label: t('Earn'),
    href: '/farms',
    disabled: true,
    icon: EarnIcon,
    fillIcon: EarnFillIcon,
    image: '/images/decorations/pe2.png',
    items: [
      {
        label: t('Farms'),
        href: '/farms',
        status: { text: t('Soon'), color: 'warning' },
        disabled: true,
      },
      {
        label: t('Pools'),
        href: '/pools',
        status: { text: t('Soon'), color: 'warning' },
        disabled: true,
      },
    ],
  },
  {
    label: '',
    href: '/ifo',
    icon: MoreIcon,
    hideSubNav: true,
    disabled: true,
    items: [
      {
        label: t('IFO'),
        href: '/ifo',
        disabled: true,
        status: { text: t('Soon'), color: 'warning' },
      },
    ],
  },
]

export const getActiveMenuItem = ({ pathname, menuConfig }: { pathname: string; menuConfig: ConfigMenuItemsType[] }) =>
  menuConfig.find((menuItem) => pathname.startsWith(menuItem.href) || getActiveSubMenuItem({ menuItem, pathname }))

export const getActiveSubMenuItem = ({ pathname, menuItem }: { pathname: string; menuItem?: ConfigMenuItemsType }) => {
  const activeSubMenuItems =
    menuItem?.items?.filter((subMenuItem) => subMenuItem.href && pathname.startsWith(subMenuItem.href)) ?? []

  // Pathname doesn't include any submenu item href - return undefined
  if (!activeSubMenuItems || activeSubMenuItems.length === 0) {
    return undefined
  }

  // Pathname includes one sub menu item href - return it
  if (activeSubMenuItems.length === 1) {
    return activeSubMenuItems[0]
  }

  // Pathname includes multiple sub menu item hrefs - find the most specific match
  const mostSpecificMatch = orderBy(activeSubMenuItems, (subMenuItem) => subMenuItem?.href?.length, 'desc')[0]

  return mostSpecificMatch
}

export const Menu = ({ children }: { children: ReactNode }) => {
  const { currentLanguage, setLanguage, t } = useTranslation()

  const menuItems = useMemo(() => config(t), [t])
  const { pathname } = useRouter()
  const activeMenuItem = getActiveMenuItem({ menuConfig: menuItems, pathname })
  const activeSubMenuItem = getActiveSubMenuItem({ menuItem: activeMenuItem, pathname })
  const { setTheme, resolvedTheme } = useTheme()
  const [show] = usePhishingBanner()

  const { data: cakePrice } = useCakePrice()

  const isDark = resolvedTheme === 'dark'

  const toggleTheme = useMemo(() => {
    return () => setTheme(isDark ? 'light' : 'dark')
  }, [setTheme, isDark])

  const getFooterLinks = useMemo(() => {
    return footerLinks(t)
  }, [t])

  return (
    <UIMenu
      linkComponent={(linkProps) => {
        return <NextLinkFromReactRouter to={linkProps.href} {...linkProps} prefetch={false} />
      }}
      links={menuItems}
      activeItem={activeMenuItem?.href}
      isDark={isDark}
      banner={show ? <PhishingWarningBanner /> : undefined}
      rightSide={
        <>
          <SettingsButton mr="8px" />
          <NetworkSwitcher />
          <UserMenu />
        </>
      }
      setLang={setLanguage}
      footerLinks={getFooterLinks}
      currentLang={currentLanguage.code}
      langs={languageList}
      cakePriceUsd={cakePrice ? Number(cakePrice) : undefined}
      // @ts-ignore
      subLinks={activeMenuItem?.hideSubNav || activeSubMenuItem?.hideSubNav ? [] : activeMenuItem?.items}
      activeSubItem={activeSubMenuItem?.href}
      toggleTheme={toggleTheme}
      buyCakeLabel={t('Buy CAKE')}
    >
      {children}
    </UIMenu>
  )
}
