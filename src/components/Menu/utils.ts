import { MenuItemsType } from '@pancakeswap/uikit'

export const getActiveMenuItem = ({ pathname, menuConfig }: { pathname: string; menuConfig: MenuItemsType[] }) =>
  menuConfig.find((menuItem) => pathname.includes(menuItem.href))

export const getActiveSubMenuItem = ({ pathname, menuItem }: { pathname: string; menuItem?: MenuItemsType }) =>
  menuItem?.items.find((subMenuItem) => pathname.includes(subMenuItem.href))
