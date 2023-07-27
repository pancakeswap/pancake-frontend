import { useTranslation } from '@pancakeswap/localization'
import { OptionProps } from '@pancakeswap/uikit'

export type NotifyType = {
  title: string
  description: string
}

export type DummyNotifyType = Omit<NotifyType, 'checked' | 'onChange'>

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

export const DummyNotificationData: DummyNotifyType[] = [
  {
    title: 'Liquidity Notification',
    description: 'BNB-CAKE (#123456) is going out of range',
  },
  {
    title: 'Liquidity Notification',
    description: 'BNB-CAKE (#123456) is going out of range',
  },
  {
    title: 'XYZ Notification',
    description: 'BNB-CAKE (#123456) is going out of range',
  },
  {
    title: 'XYZ Notification',
    description: 'BNB-CAKE (#123456) is going out of range',
  },
]

export const NotificationFilterTypes: OptionProps[] = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Liquidity',
    value: 'liquidity',
  },
  {
    label: 'Staking',
    value: 'staking',
  },
  {
    label: 'Pools',
    value: 'pools',
  },
  {
    label: 'Farm',
    value: 'farms',
  },
]

export const NotificationSortTypes: OptionProps[] = [
  {
    label: 'Oldest',
    value: 'oldest',
  },
  {
    label: 'Latest',
    value: 'lates',
  },
]
