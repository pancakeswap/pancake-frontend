import { createAction } from '@reduxjs/toolkit'

export const setHasUnread = createAction<{
  subscriptionId: string
  notificationId: string
  hasUnread: boolean
}>('notifications/setHasUnread')

export const setImportantAlerts = createAction<{
  subscriptionId: string
  importantOnly: boolean
}>('notifications/setImportantAlerts')

export const toggleAllowNotifications = createAction<{
  allowNotifications: boolean
}>('notifications/toggleAllowNotifications')
