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
    label: 'Spawning Pools',
    icon: 'PoolIcon',
    items: [
      {
        label: 'Coming This Week!',
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
