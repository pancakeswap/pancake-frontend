import { createReducer } from '@reduxjs/toolkit'
import { NotifyClientTypes } from '@walletconnect/notify-client'
import { setHasUnread, setImportantAlerts, toggleAllowNotifications } from './actions'

export type NotificationDetails = NotifyClientTypes.NotifyNotification & { timestamp: number }

export interface NotificationState {
  notifications: {
    [subscriptionId: string]: {
      unread: { [notificationId: string]: boolean }
      importantAlertsOnly: boolean
    }
  }
  allowNotifications: undefined | boolean
}

export const initialState: NotificationState = {
  notifications: {},
  allowNotifications: true,
}

export default createReducer(initialState, (builder) =>
  builder
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
    }),
)
