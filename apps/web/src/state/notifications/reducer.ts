/* eslint-disable no-param-reassign */
import { createReducer } from '@reduxjs/toolkit'
import { NotifyClientTypes } from '@walletconnect/notify-client'
import { addArchivedNotification, clearArchivedTransactions } from './actions'

export type NotificationDetails = NotifyClientTypes.NotifyMessageRecord & { timestamp: number }
export interface NotificationState {
  [subscriptionId: string]: {
    [notificationId: string]: NotificationDetails
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
        const txs = notifications[subscriptionId] ?? {}
        txs[notificationId] = { ...notification, timestamp }
        notifications[subscriptionId] = txs
      },
    )
    .addCase(clearArchivedTransactions, (notifications, { payload: { subscriptionId } }) => {
      const txs = notifications[subscriptionId] ?? {}
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
        [subscriptionId]: filteredNotifications,
      }
    }),
)
