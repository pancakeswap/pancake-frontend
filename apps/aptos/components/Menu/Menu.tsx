/* eslint-disable jsx-a11y/anchor-is-valid */
import { languageList, useTranslation } from '@pancakeswap/localization'
import { Menu as UIMenu } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'

import { usePhishingBanner } from '@pancakeswap/utils/user'
import { NetworkSwitcher } from 'components/NetworkSwitcher'
import PhishingWarningBanner from 'components/PhishingWarningBanner'
import { useActiveChainId } from 'hooks/useNetwork'
import { useCakePrice } from 'hooks/useStablePrice'
import orderBy from 'lodash/orderBy'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { SettingsButton } from './Settings/SettingsButton'
import UserMenu from './UserMenu'
import { footerLinks } from './footerConfig'
import { ConfigMenuItemsType, useMenuItems } from './hooks/useMenuItems'

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

const LinkComponent = (linkProps) => {
  return <NextLinkFromReactRouter to={linkProps.href} {...linkProps} prefetch={false} />
}

export const Menu = (props) => {
  const { currentLanguage, setLanguage, t } = useTranslation()

  const menuItems = useMenuItems()
  const { pathname } = useRouter()
  const activeMenuItem = getActiveMenuItem({ menuConfig: menuItems, pathname })
  const activeSubMenuItem = getActiveSubMenuItem({ menuItem: activeMenuItem, pathname })
  const { setTheme, resolvedTheme } = useTheme()
  const [show] = usePhishingBanner()
  const chainId = useActiveChainId()

  const { data: cakePrice } = useCakePrice()

  const isDark = resolvedTheme === 'dark'

  const toggleTheme = useMemo(() => {
    return () => setTheme(isDark ? 'light' : 'dark')
  }, [setTheme, isDark])

  const getFooterLinks = useMemo(() => {
    return footerLinks(t)
  }, [t])

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      {isClient ? (
        <UIMenu
          linkComponent={LinkComponent}
          chainId={chainId}
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
          buyCakeLink="https://aptos.pancakeswap.finance/swap?outputCurrency=0x159df6b7689437016108a019fd5bef736bac692b6d4a1f10c941f6fbb9a74ca6::oft::CakeOFT"
          {...props}
        />
      ) : undefined}
    </>
  )
}
