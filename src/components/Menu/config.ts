import { MenuEntry } from '@rug-zombie-libs/uikit'

const config: MenuEntry[] = [
  {
    label: 'Home',
    icon: 'HomeIcon',
    href: '/home',
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
    label: 'Mausoleum (BETA)',
    icon: 'PredictionsIcon',
    href: '/mausoleum',
  },
  {
    label: 'Spawning Pools',
    icon: 'PoolIcon',
    items: [
      {
        label: 'Coming This Week!',
        href: 'https://rugzombie.medium.com/first-spawn-gorilla-fi-g-fi-f16a234047f7',
      },
    ],
  },
  {
    label: 'Graveyard',
    icon: 'NftIcon',
    items: [
      {
        label: '(NFT Viewer) Coming Soon!',
        href: '/',
      },
    ],
  },
  {
    label: 'Referral Program',
    icon: 'TeamBattleIcon',
    items: [
      {
        label: 'In development',
        href: '/',
      },
    ],
  },
  {
    label: 'More',
    icon: 'MoreIcon',
    items: [
      {
        label: 'Contact',
        href: 'https://rugzombie.gitbook.io/docs/feedback-suggestions-and-bug-bounty',
      },
      {
        label: 'Github',
        href: 'https://github.com/Rug-Zombie',
      },
      {
        label: 'Docs',
        href: 'https://rugzombie.gitbook.io/docs/',
      },
    ],
  },
]

export default config
