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
