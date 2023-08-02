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
