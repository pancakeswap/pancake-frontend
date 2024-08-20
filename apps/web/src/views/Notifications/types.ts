import { ContextApi } from '@pancakeswap/localization'

export enum ResponseEvents {
  NotificationsEnabled = 'NotificationsEnabled',
  NotificationsEnabledError = 'NotificationsEnabledError',
  SubscriptionRequestError = 'SubscriptionRequestError',
  PreferencesUpdated = 'PreferencesUpdated',
  PreferencesError = 'PreferencesError',
  UnsubscribeError = 'UnsubscribeError',
  Unsubscribed = 'Unsubscribed',
}

enum ScopeIdsToName {
  Lottery = 'b42403b3-2712-4e1e-8cc7-cb2d9c1350b4',
  Prediction = '52816341-59cd-49e2-8f3b-d15bf2c107fb',
  Liquidity = '02879833-eb9c-4cc3-8760-f762ab218ca6',
  Farms = 'cf41e730-22d8-42d6-a7d5-1e79b6f7820b',
  PriceUpdates = '627396d7-23ba-4a82-b83d-2aa6ba1110e6',
  Promotional = '87393202-5cd7-4a0b-a672-bd4eded25e7b',
  Alerts = '069d1195-50a0-47b0-81a6-2df3024831ba',
  TradingReward = 'e0a3aeb3-3ec2-496d-b6c7-343185de6aca',
}

export enum SubsctiptionType {
  Lottery = ScopeIdsToName.Lottery,
  Prediction = ScopeIdsToName.Prediction,
  Liquidity = ScopeIdsToName.Liquidity,
  Farms = ScopeIdsToName.Farms,
  PriceUpdates = ScopeIdsToName.PriceUpdates,
  Promotional = ScopeIdsToName.Promotional,
  Alerts = ScopeIdsToName.Alerts,
  TradingReward = ScopeIdsToName.TradingReward,
}

export enum PAGE_VIEW {
  OnboardView = 0,
  NotificationView = 1,
  SettingsView = 2,
}

export type EventInformation = {
  title: (t: ContextApi['t']) => string
  message?: (t: any, error?: any) => string
}

export type Scope = {
  name: string
  id: string
  description: string
  enabled: boolean
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

export enum BuilderNames {
  onBoardingNotification = 'onBoardingNotification',
  newLpNotification = 'newLpNotification',
}
export type pushNotification = {
  title: string
  body: string
  icon: string
  url?: string
  type: string
}

export type NotificationPayload = {
  accounts: string[]
  notification: pushNotification
}

export interface PancakeNotificationBuilders {
  ['newLpNotification']: {
    newLpPositionNotification: (
      token1: string,
      token2: string,
      token1Amount: string,
      token2Amount: string,
    ) => pushNotification
  }
  ['onBoardingNotification']: {
    onBoardingNotification: () => pushNotification
  }
}
