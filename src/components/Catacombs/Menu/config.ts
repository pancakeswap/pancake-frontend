import { MenuEntry } from '@catacombs-libs/uikit'
import { CatacombsRoutes } from './catacombs_routes'

const config: MenuEntry[] = [
  {
    label: 'Home',
    icon: 'HomeIcon',
    href: '/catacombs',
  },
  {
    label: 'Barracks',
    icon: 'PoolIcon',
    href: '/catacombs/' + CatacombsRoutes.BARRACKS,
  },
  {
    label: 'Rug Roll',
    icon: 'FarmIcon',
    href: '/catacombs/' + CatacombsRoutes.RUGROLL,
  },
  {
    label: 'Data Lab',
    icon: 'FarmIcon',
    href: '/catacombs/' + CatacombsRoutes.DATALAB,
  },
  {
    label: 'Black Market',
    icon: 'FarmIcon',
    href: '/catacombs/' + CatacombsRoutes.BLACKMARKET,
  },
]

export default config
