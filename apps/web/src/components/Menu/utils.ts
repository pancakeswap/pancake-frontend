import orderBy from 'lodash/orderBy'
import { ConfigMenuItemsType } from './config/config'

export const getActiveMenuItem = ({ pathname, menuConfig }: { pathname: string; menuConfig: ConfigMenuItemsType[] }) =>
  menuConfig.find((menuItem) => {
    return (
      (pathname.startsWith(menuItem.href) && menuItem.href !== '/') ||
      menuItem.href === pathname ||
      getActiveSubMenuItem({ menuItem, pathname }) ||
      getActiveSubMenuChildItem({ menuItem, pathname })
    )
  })

export const getActiveSubMenuItem = ({ pathname, menuItem }: { pathname: string; menuItem?: ConfigMenuItemsType }) => {
  const activeSubMenuItems =
    menuItem?.items?.filter((subMenuItem) => {
      if (
        (subMenuItem?.href && pathname.startsWith(subMenuItem?.href) && subMenuItem?.href !== '/') ||
        pathname === subMenuItem?.href
      ) {
        return true
      }
      if (subMenuItem?.matchHrefs?.some((matchHref) => pathname.startsWith(matchHref))) {
        return true
      }
      return false
    }) ?? []

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

export const getActiveSubMenuChildItem = ({
  pathname,
  menuItem,
}: {
  pathname: string
  menuItem?: ConfigMenuItemsType
}) => {
  const getChildItems = menuItem?.items
    ?.map((i) => [...(i.items ?? []), ...(i.overrideSubNavItems ?? [])])
    ?.filter(Boolean)
    .flat()

  const activeSubMenuItems =
    getChildItems?.filter((subMenuItem) => subMenuItem?.href && pathname.startsWith(subMenuItem?.href)) ?? []

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
