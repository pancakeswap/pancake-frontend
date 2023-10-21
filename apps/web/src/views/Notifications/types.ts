export enum ResponseEvents {
  SignatureRequest = 'SignatureRequest',
  SignatureRequestError = 'SignatureRequestError',
  SubscriptionRequestError = 'SubscriptionRequestError',
  PreferencesUpdated = 'PreferencesUpdated',
  PreferencesError = 'PreferencesError',
  UnsubscribeError = 'UnsubscribeError',
  Unsubscribed = 'Unsubscribed',
}

export enum SubsctiptionType {
  Lottery = 'Lottery',
  Prediction = 'Prediction',
  Liquidity = 'Liquidity',
  Farms = 'Farms',
  PriceUpdates = 'PriceUpdates',
  Promotional = 'Promotional',
  Alerts = 'alerts',
}

export type EventInformation = {
  title: string
  message?: string
}

export enum NotificationView {
  onBoarding,
  Notifications,
  Settings,
}

export type NotificationType = {
  account: string
  date: number
  description: string
  id: number
  title: string
  type: string
}

export type NotifyType = {
  title: string
  description: string
}

export type RelayerType = {
  value: string | undefined
  label: string
}

export type SubscriptionState = {
  isSubscribing: boolean
  isSubscribed: boolean
  isUnsubscribing: boolean
  isOnboarding: boolean
  isOnboarded: boolean
}

export enum BuilderNames {
  OnBoardNotification = 'OnBoardNotification',
  newLpNotification = 'newLpNotification',
}
export type pushNotification = {
  title: string
  body: string
  icon: string
  url: string
  type: string
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
