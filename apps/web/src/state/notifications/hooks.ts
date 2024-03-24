import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { AppState, useAppDispatch } from 'state'
import { toggleAllowNotifications } from './actions'
import { NotificationState } from './reducer'

export function useHasUnreadNotifications(subscription: string | undefined): {
  unreadLength: number
  unreadNotificationKeys: string[]
} {
  const state: NotificationState = useSelector<AppState, AppState['notifications']>((s) => s.notifications)

  if (!subscription) return { unreadLength: 0, unreadNotificationKeys: [] }
  if (!state.notifications?.[subscription]?.unread) return { unreadLength: 0, unreadNotificationKeys: [] }

  const unreadNotifications = Object.values(state.notifications?.[subscription].unread).filter((unread) => !unread)
  const unreadNotificationKeys = Object.keys(state.notifications?.[subscription].unread)
  return { unreadLength: unreadNotifications.length, unreadNotificationKeys }
}

export function useHasUnreadNotification(subscription: string | undefined, notificationId: string): boolean {
  const state: NotificationState = useSelector<AppState, AppState['notifications']>((s) => s.notifications)
  if (!subscription) return false
  if (!state.notifications?.[subscription]?.unread) return false
  const unreadNotifications = state.notifications?.[subscription].unread
  return unreadNotifications[notificationId]
}

export function useImportantNotificationsOnly(subscription: string | undefined): boolean {
  const state: NotificationState = useSelector<AppState, AppState['notifications']>((s) => s.notifications)

  if (!subscription) return false
  if (!state.notifications?.[subscription]?.importantAlertsOnly) return false

  return state.notifications?.[subscription].importantAlertsOnly
}

export function useAllowNotifications(): [boolean | undefined, (allowNotifications: boolean) => void] {
  const dispatch = useAppDispatch()
  const allowNotifications = useSelector<AppState, AppState['notifications']['allowNotifications']>((state) => {
    return state.notifications.allowNotifications
  })

  const setAllowNotifications = useCallback(
    (notificationsDisplay: boolean) => {
      dispatch(toggleAllowNotifications({ allowNotifications: notificationsDisplay }))
    },
    [dispatch],
  )

  return [allowNotifications, setAllowNotifications]
}
