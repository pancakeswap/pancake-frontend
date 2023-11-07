export enum ResponseEvents {
  SignatureRequest = 'SignatureRequest',
  SignatureRequestError = 'SignatureRequestError',
  SubscriptionRequestError = 'SubscriptionRequestError',
  PreferencesUpdated = 'PreferencesUpdated',
  PreferencesError = 'PreferencesError',
  UnsubscribeError = 'UnsubscribeError',
  Unsubscribed = 'Unsubscribed',
}

enum ScopeIdsToName {
  Lottery = '81be3ea1-c562-433d-9dfe-d709ce7d3719',
  Prediction = '5759ebab-f70c-4f83-9fa0-36b6e6513c94',
  Liquidity = 'd0173b5f-5564-4e78-9e87-bf6016bb99b2',
  Farms = '7b43cae7-6e49-4644-aa3f-fb28883c9576',
  PriceUpdates = 'ad885f1d-3f25-46ea-916a-7ebe630b6f98',
  Promotional = ' 5e0b7598-7fbe-4695-8a3c-b14cb4b78a11',
  Alerts = 'bf991425-0c3e-448c-87f9-b116decea164',
}

export enum SubsctiptionType {
  Lottery = ScopeIdsToName.Lottery,
  Prediction = ScopeIdsToName.Prediction,
  Liquidity = ScopeIdsToName.Liquidity,
  Farms = ScopeIdsToName.Farms,
  PriceUpdates = ScopeIdsToName.PriceUpdates,
  Promotional = ScopeIdsToName.Promotional,
  Alerts = ScopeIdsToName.Alerts,
}

export enum PAGE_VIEW {
  OnboardView = 0,
  NotificationView = 1,
  SettingsView = 2,
}

export type EventInformation = {
  title: string
  message?: string
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
