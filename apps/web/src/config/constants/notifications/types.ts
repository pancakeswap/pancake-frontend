export type pushNotifyTypes = 'Liquidity' | 'Staking' | 'Pools' | 'Farms' | 'alerts'
export enum BuilderNames {
  OnBoardNotification = 'OnBoardNotification',
  newLpNotification = 'newLpNotification',
}
export type pushNotification = {
  title: string
  body: string
  icon: string
  url: string
  type: pushNotifyTypes
}

export type NotificationPayload = {
  accounts: string[]
  notification: pushNotification
}

export interface PancakeNotificationBuilders {
  ['OnBoardNotification']: { onBoardNotification: () => pushNotification }
  ['newLpNotification']: {
    newLpPositionNotification: (
      token1: string,
      token2: string,
      token1Amount: string,
      token2Amount: string,
    ) => pushNotification
  }
}
