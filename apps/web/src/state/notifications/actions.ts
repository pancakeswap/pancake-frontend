import { createAction } from '@reduxjs/toolkit'
import { NotifyClientTypes } from '@walletconnect/notify-client'

export const addArchivedNotification = createAction<{
  timestamp: number
  notification: NotifyClientTypes.NotifyMessageRecord
  subscriptionId: string
  notificationId: string
}>('notifications/addArchivedNotification')

export const clearArchivedTransactions = createAction<{
  subscriptionId: string
}>('notifications/clearArchivedTransactions')

export const setHasUnread = createAction<{
  subscriptionId: string
  notificationId: number
  hasUnread: boolean
}>('notifications/setHasUnread')

export const setImportantAlerts = createAction<{
  subscriptionId: string
  importantOnly: boolean
}>('notifications/setImportantAlerts')

export const toggleAllowNotifications = createAction<{
  allowNotifications: boolean
}>('notifications/toggleAllowNotifications')
