import { OptionProps } from '@pancakeswap/uikit'
import { NotifyType, RelayerType } from './types'

export const DEFAULT_NOTIFICATIONS: NotifyType[] = [
  {
    title: 'Liquidity Notifications',
    description: 'Recieve notifications when your V3 LP position goes out of range',
  },
  {
    title: 'Staking Notifications',
    description: 'Recieve notifications when a fixed term staking period ends',
  },
  {
    title: 'Pool Notifications',
    description: 'Recieve notifications for new syrup pool or important pool updates',
  },
  {
    title: 'Farm Notifications',
    description: 'Recieve notifications for initial arm offerings or newly deployted farms',
  },
]

export const NotificationFilterTypes: OptionProps[] = [
  {
    label: 'All',
    value: 'All',
  },
  {
    label: 'Liquidity',
    value: 'Liquidity',
  },
  {
    label: 'Staking',
    value: 'Staking',
  },
  {
    label: 'Pools',
    value: 'Pools',
  },
  {
    label: 'Farm',
    value: 'Farms',
  },
]

export const NotificationSortTypes: OptionProps[] = [
  {
    label: 'Oldest',
    value: 'Oldest',
  },
  {
    label: 'Latest',
    value: 'Latest',
  },
]

if (!process.env.NEXT_PUBLIC_PROJECT_ID) throw new Error('`NEXT_PUBLIC_PROJECT_ID` env variable is missing.')

export const DEFAULT_PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID
export const DEFAULT_RELAY_URL = process.env.NEXT_PUBLIC_RELAY_URL

export const DEFAULT_LOGGER = 'debug'

export const DEFAULT_APP_METADATA = {
  description: 'local',
  icons: ['https://i.imgur.com/q9QDRXc.png'],
  name: 'local',
  url: 'https://pc-custom-web.vercel.app',
}

export const REGIONALIZED_RELAYER_ENDPOINTS: RelayerType[] = [
  {
    value: DEFAULT_RELAY_URL,
    label: 'Default',
  },

  {
    value: 'wss://us-east-1.relay.walletconnect.com',
    label: 'US',
  },
  {
    value: 'wss://eu-central-1.relay.walletconnect.com',
    label: 'EU',
  },
  {
    value: 'wss://ap-southeast-1.relay.walletconnect.com',
    label: 'Asia Pacific',
  },
]

