export type NotifyType = {
  title: string
  description: string
  checked: boolean
  onChange: () => void
}

export type DummyNotifyType = Omit<NotifyType, 'checked' | 'onChange'>

export const DEFAULT_NOTIFICATIONS: NotifyType[] = [
  {
    title: 'Liquidity Notifications',
    description: 'Recieve notifications when your V3 LP position goes out of range',
    checked: true,
    onChange: () => null,
  },
  {
    title: 'Staking Notifications',
    description: 'Recieve notifications when a fixed term staking period ends',
    checked: false,
    onChange: () => null,
  },
  {
    title: 'Pool Notifications',
    description: 'Recieve notifications for new syrup pool or important pool updates',
    checked: false,
    onChange: () => null,
  },
  {
    title: 'Farm Notifications',
    description: 'Recieve notifications for initial arm offerings or newly deployted farms',
    checked: false,
    onChange: () => null,
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
