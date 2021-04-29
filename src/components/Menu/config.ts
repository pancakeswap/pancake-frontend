import { MenuEntry } from '@rootswap-libs-dev/uikit'

const config: MenuEntry[] = [
  {
    label: 'Home',
    icon: 'HomeIcon',
    href: '/',
  },
  {
    label: 'Trade',
    icon: 'TradeIcon',
    items: [
      {
        label: 'Exchange',
        href: 'https://exchange.rootswap.finance',
      },
      {
        label: 'Liquidity',
        href: 'https://exchange.rootswap.finance/#/pool',
      },
    ],
  },
  
]

export default config
