import { ContextApi } from '@pancakeswap/localization'
import { DropdownMenuItems, MenuItemsType } from '@pancakeswap/uikit'

export type ConfigMenuDropDownItemsType = DropdownMenuItems & { hideSubNav?: boolean }
export type ConfigMenuItemsType = Omit<MenuItemsType, 'items'> & { hideSubNav?: boolean; image?: string } & {
  items?: ConfigMenuDropDownItemsType[]
}

const addMenuItemSupported = (item: any, chainId: any) => {
  if (!chainId || !item.supportChainIds) {
    return item
  }
  if (item.supportChainIds?.includes(chainId)) {
    return item
  }
  return {
    ...item,
    disabled: true,
  }
}

const config: (
  t: ContextApi['t'],
  isDark: boolean,
  languageCode?: string,
  chainId?: number,
) => ConfigMenuItemsType[] = (t, isDark, languageCode, chainId) =>
  [
    {
      label: t('Explore Quests'),
      href: '/',
    },
    {
      label: t('Explore Campaigns'),
      href: '/campaigns',
    },
    {
      label: t('Dashboard'),
      href: '/dashboard',
    },
  ].map((item) => addMenuItemSupported(item, chainId))

export default config
