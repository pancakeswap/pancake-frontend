import { MenuItemsType } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'


export type ConfigMenuItemsType = MenuItemsType & { hideSubNav?: boolean }

const config: (t: ContextApi['t']) => ConfigMenuItemsType[] = (t) => [
  {
    label: t('Exchange'),
    icon: 'Swap',
    href: '/swap',
    showItemsOnMobile: false,
    hideSubNav: false,
    items: [],
  },

 
  {
    label: t('Info'),
    icon: 'Info',
    href: '/info',
    showItemsOnMobile: false,
    hideSubNav: false,
    items: [    ],
  },
]

export default config
