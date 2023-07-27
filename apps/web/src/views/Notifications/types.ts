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
