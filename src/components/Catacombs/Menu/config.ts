import { MenuEntry } from '@catacombs-libs/uikit'

const config: MenuEntry[] = [
  {
    label: 'Home',
    icon: 'HomeIcon',
    href: '/catacombs',
  },
  {
    label: 'Barracks',
    icon: 'PoolIcon',
    href: `/barracks`,
  },
  {
    label: 'Rug Roll',
    icon: 'FarmIcon',
    href: `/rugroll`,
  },
  {
    label: 'Data Lab',
    icon: 'FarmIcon',
    href: `/datalab`,
  },
  {
    label: 'Black Market',
    icon: 'FarmIcon',
    href: `/blackmarket`,
  },
]

export default config
