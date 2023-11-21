/* eslint-disable no-param-reassign */
import { createReducer } from '@reduxjs/toolkit'
import { NotifyClientTypes } from '@walletconnect/notify-client'
import { addArchivedNotification, clearArchivedTransactions, setHasUnread, setImportantAlerts } from './actions'

export type NotificationDetails = NotifyClientTypes.NotifyMessageRecord & { timestamp: number }
export interface NotificationState {
  [subscriptionId: string]: {
    notifications: { [notificationId: string]: NotificationDetails }
    unread: { [notificationId: string]: boolean }
    importantAlertsOnly: boolean
  }
}

export const initialState: NotificationState = {}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(
      addArchivedNotification,
      (notifications, { payload: { timestamp, notification, subscriptionId, notificationId } }) => {
        if (notifications[subscriptionId]?.[notificationId]) {
          throw Error('Attempted to add existing transaction.')
        }
        const txs = notifications[subscriptionId].notifications ?? {}
        txs[notificationId] = { ...notification, timestamp }
        notifications[subscriptionId].notifications = txs
      },
    )
    .addCase(setHasUnread, (notifications, { payload: { subscriptionId, notificationId, hasUnread } }) => {
      return {
        ...notifications,
        [subscriptionId]: {
          ...notifications[subscriptionId],
          unread: {
            ...(notifications[subscriptionId]?.unread ?? {}),
            [notificationId]: hasUnread,
          },
        },
      }
    })
    .addCase(setImportantAlerts, (notifications, { payload: { subscriptionId, importantOnly } }) => {
      return {
        ...notifications,
        [subscriptionId]: {
          ...notifications[subscriptionId],
          importantAlertsOnly: importantOnly,
        },
      }
    })
    .addCase(clearArchivedTransactions, (notifications, { payload: { subscriptionId } }) => {
      const txs = notifications[subscriptionId]?.notifications ?? {}
      const twentyFourHoursAgo = Math.floor(new Date().getTime() / 1000) - 3600 * 24

      const filteredNotifications = Object.keys(txs).reduce((filtered, notificationId) => {
        const notification = txs[notificationId]
        if (notification.timestamp >= twentyFourHoursAgo) {
          filtered[notificationId] = notification
        }
        return filtered
      }, {})

      return {
        ...notifications,
        [subscriptionId]: {
          ...notifications[subscriptionId],
          notifications: filteredNotifications,
        },
      }
    }),
)
