import { useCallback } from 'react'
import { toggleAllowNotifications } from './actions'
import { NotificationDetails, useNotificationsState } from './reducer'

export function useAllNotifications(subscription: string | undefined): NotificationDetails[] {
  const [state] = useNotificationsState()

  if (!subscription) return []
  if (!state.notifications?.[subscription]?.notifications) return []

  const notifications = Object.values(state.notifications?.[subscription].notifications)
  return notifications
}

export function useHasUnreadNotifications(subscription: string | undefined): boolean {
  const [state] = useNotificationsState()

  if (!subscription) return false
  if (!state.notifications?.[subscription]?.unread) return false

  const unreadNotifications = Object.values(state.notifications?.[subscription].unread).filter((unread) => !unread)
  return unreadNotifications.length > 0
}

export function useHasUnreadNotification(subscription: string | undefined, notificationId: number): boolean {
  const [state] = useNotificationsState()
  if (!subscription) return false
  if (!state.notifications?.[subscription]?.unread) return false
  const unreadNotifications = state.notifications?.[subscription].unread
  return unreadNotifications[notificationId]
}

export function useImportantNotificationsOnly(subscription: string | undefined): boolean {
  const [state] = useNotificationsState()

  if (!subscription) return false
  if (!state.notifications?.[subscription]?.importantAlertsOnly) return false

  return state.notifications?.[subscription].importantAlertsOnly
}

export function useAllowNotifications(): [boolean | undefined, (allowNotifications: boolean) => void] {
  const [state, dispatch] = useNotificationsState()
  const { allowNotifications } = state

  const setAllowNotifications = useCallback(
    (notificationsDisplay: boolean) => {
      dispatch(toggleAllowNotifications({ allowNotifications: notificationsDisplay }))
    },
    [dispatch],
  )

  return [allowNotifications, setAllowNotifications]
}
