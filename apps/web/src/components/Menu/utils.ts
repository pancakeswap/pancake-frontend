import orderBy from 'lodash/orderBy'
import { ConfigMenuItemsType } from './config/config'

export const isSubpath = (path: string, path2: string,skiproot:boolean = true) => {
  if (path === path2 || path === '/' || path2 === '/' && skiproot) {
    return path === path2;
  }
  return path.startsWith(path2);
};

export const getActiveMenuItem = ({ pathname, menuConfig }: { pathname: string; menuConfig: ConfigMenuItemsType[] }) => {
  return menuConfig.find((menuItem) => isSubpath(pathname,menuItem.href) || getActiveSubMenuItem({ menuItem, pathname }))
};

export const getActiveSubMenuItem = ({ pathname, menuItem }: { pathname: string; menuItem?: ConfigMenuItemsType }) => {
  const activeSubMenuItems = menuItem?.items.filter((subMenuItem) => isSubpath(pathname,subMenuItem.href)) ?? []

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
