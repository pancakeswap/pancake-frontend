import { createReducer } from '@reduxjs/toolkit'
import { NotifyClientTypes } from '@walletconnect/notify-client'
import { atomWithStorage, createJSONStorage, useReducerAtom } from 'jotai/utils'
import {
  addArchivedNotification,
  clearArchivedTransactions,
  setHasUnread,
  setImportantAlerts,
  toggleAllowNotifications,
} from './actions'

export type NotificationDetails = NotifyClientTypes.NotifyMessageRecord & { timestamp: number }

export interface NotificationState {
  notifications: {
    [subscriptionId: string]: {
      notifications: { [notificationId: string]: NotificationDetails }
      unread: { [notificationId: string]: boolean }
      importantAlertsOnly: boolean
    }
  }
  allowNotifications: undefined | boolean
}

export const initialState: NotificationState = {
  notifications: {},
  allowNotifications: undefined,
}

const reducer = createReducer(initialState, (builder) =>
  builder
    .addCase(
      addArchivedNotification,
      (state, { payload: { timestamp, notification, subscriptionId, notificationId } }) => {
        const subscriptionNotifications = state.notifications?.[subscriptionId]

        return {
          ...state,
          notifications: {
            ...state.notifications,
            [subscriptionId]: {
              ...subscriptionNotifications,
              notifications: {
                ...(subscriptionNotifications?.notifications ?? {}),
                [notificationId]: { ...notification, timestamp },
              },
            },
          },
        }
      },
    )
    .addCase(setHasUnread, (notifications, { payload: { subscriptionId, notificationId, hasUnread } }) => {
      return {
        ...notifications,
        notifications: {
          ...notifications.notifications,
          [subscriptionId]: {
            ...notifications?.notifications?.[subscriptionId],
            unread: {
              ...(notifications?.notifications?.[subscriptionId]?.unread ?? {}),
              [notificationId]: hasUnread,
            },
          },
        },
      }
    })
    .addCase(setImportantAlerts, (notifications, { payload: { subscriptionId, importantOnly } }) => {
      return {
        ...notifications,
        notifications: {
          ...notifications.notifications,
          [subscriptionId]: {
            ...notifications?.notifications?.[subscriptionId],
            importantAlertsOnly: importantOnly,
          },
        },
      }
    })
    .addCase(toggleAllowNotifications, (notifications, { payload: { allowNotifications } }) => {
      return {
        ...notifications,
        allowNotifications,
      }
    })
    .addCase(clearArchivedTransactions, (notifications, { payload: { subscriptionId } }) => {
      const txs = notifications.notifications?.[subscriptionId]?.notifications ?? {}
      const twentyFourHoursAgo = Math.floor(new Date().getTime() / 1000) - 3600 * 24

      const filteredNotifications = Object.keys(txs).reduce((filtered, notificationId) => {
        const notification = txs[notificationId]
        if (notification.timestamp >= twentyFourHoursAgo) {
          // eslint-disable-next-line no-param-reassign
          filtered[notificationId] = notification
        }
        return filtered
      }, {})

      return {
        ...notifications,
        notifications: {
          ...notifications.notifications,
          [subscriptionId]: {
            ...notifications?.notifications?.[subscriptionId],
            notifications: filteredNotifications,
          },
        },
      }
    }),
)

const storage = createJSONStorage<NotificationState>(() => localStorage)

const notificationsAtom = atomWithStorage('pcs:notifications', initialState, storage)

export function useNotificationsState() {
  return useReducerAtom(notificationsAtom, reducer)
}
