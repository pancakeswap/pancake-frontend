import { NavProps } from '@pancakeswap-libs/uikit'

const links: NavProps['links'] = [
  {
    label: 'Trade',
    items: [
      {
        label: 'Exchange',
        href: 'https://exchange.pancakeswap.finance',
      },
      {
        label: 'Liquidity',
        href: 'https://exchange.pancakeswap.finance/#/pool',
      },
    ],
  },
  {
    label: 'Farms',
    href: '/farms',
  },
  {
    label: 'Pools',
    href: '/pools',
  },
  {
    label: 'Lottery',
    href: '/lottery',
  },
  {
    label: 'Info',
    href: 'https://pancakeswap.info',
  },
  {
    label: 'IFO',
    href: '/ifo',
  },
  {
    label: 'NFT',
    href: '/nft',
  },
]

export default links
