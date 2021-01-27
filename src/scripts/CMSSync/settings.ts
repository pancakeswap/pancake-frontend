import { SettingsObject, SettingsType } from './types'

const settings: SettingsObject[] = [
  {
    name: 'ifos',
    link: 'https://pancake-config-api-chefkai.pancakeswap.vercel.app/ifos',
    type: SettingsType.IFO,
  },
  {
    name: 'pools',
    link: 'https://pancake-config-api-chefkai.pancakeswap.vercel.app/pools',
    type: SettingsType.POOL,
  },
  {
    name: 'farms',
    link: 'https://pancake-config-api-chefkai.pancakeswap.vercel.app/farms',
    type: SettingsType.FARM,
  },
]
export default settings
