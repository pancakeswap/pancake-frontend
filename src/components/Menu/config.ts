import { MenuEntry } from '@rug-zombie-libs/uikit'

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
        href: 'https://exchange.pancakeswap.finance/#/swap',
      },
      {
        label: 'Liquidity',
        href: 'https://exchange.pancakeswap.finance/#/pool',
      },
      {
        label: 'LP Migration',
        href: 'https://v1exchange.pancakeswap.finance/#/migrate',
      },
      {
        label: 'V1 Liquidity (Old)',
        href: 'https://v1exchange.pancakeswap.finance/#/pool',
      },
    ],
  },
  {
    label: 'Graves',
    icon: 'PoolIcon',
    href: '/graves',
  },
  {
    label: 'Tombs',
    icon: 'FarmIcon',
    href: '/tombs',
  },
  {
    label: 'Crypts',
    icon: 'PoolIcon',
    href: '/crypts',
  },
  // {
  //   label: 'Prediction',
  //   icon: 'PredictionsIcon',
  //   href: '/prediction',
  //   status: {
  //     text: 'BETA',
  //     color: 'warning',
  //   },
  // },
  // {
  //   label: 'Lottery',
  //   icon: 'TicketIcon',
  //   href: '/lottery',
  // },
  // {
  //   label: 'Collectibles',
  //   icon: 'NftIcon',
  //   href: '/collectibles',
  // },
  // {
  //   label: 'Team Battle',
  //   icon: 'TeamBattleIcon',
  //   href: '/competition',
  // },
  // {
  //   label: 'Profile',
  //   icon: 'GroupsIcon',
  //   items: [
  //     // {
  //     //   label: 'Leaderboard',
  //     //   href: '/teams',
  //     // },
  //     {
  //       label: 'Task Center',
  //       href: '/profile/tasks',
  //     },
  //     {
  //       label: 'Your Profile',
  //       href: '/profile',
  //     },
  //   ],
  // },
  {
    label: 'Info',
    icon: 'InfoIcon',
    items: [
      {
        label: 'Overview',
        href: 'https://pancakeswap.info',
      },
      {
        label: 'Tokens',
        href: 'https://pancakeswap.info/tokens',
      },
      {
        label: 'Pairs',
        href: 'https://pancakeswap.info/pairs',
      },
      {
        label: 'Accounts',
        href: 'https://pancakeswap.info/accounts',
      },
    ],
  },
  // {
  //   label: 'IFO',
  //   icon: 'IfoIcon',
  //   href: '/ifo',
  // },
  {
    label: 'More',
    icon: 'MoreIcon',
    items: [
      {
        label: 'Contact',
        href: 'https://docs.rugzombie.io/contact-us',
      },
      {
        label: 'Github',
        href: 'https://github.com/RugZombie',
      },
      {
        label: 'Docs',
        href: 'https://docs.rugzombie.io',
      },
      {
        label: 'Blog',
        href: 'https://rugzombie.medium.com',
      },
      {
        label: 'Voting (Coming Soon!)',
        href: '',
      },
      {
        label: 'Merch (Coming Soon!)',
        href: '',
      },
    ],
  },
]

export default config
