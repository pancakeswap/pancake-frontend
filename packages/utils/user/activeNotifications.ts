import { useAtom, useAtomValue } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const initialNotificationState = {
  LiquidityNotifications: false,
  StakingNotifications: false,
  PoolNotifications: false,
  FarmNotifications: false,
}

export type NotificationType = keyof typeof initialNotificationState
export type NotificationsState = Record<NotificationType, boolean>

const notificationsAtom = atomWithStorage('pcs:notifications', initialNotificationState)

export function useActiveNotifications() {
  const [notifications, setNotifications] = useAtom(notificationsAtom)

  const toggleNotification = (notificationKey) => {
    setNotifications((prevNotifications) => ({
      ...prevNotifications,
      [notificationKey]: !prevNotifications[notificationKey],
    }))
  }

  return { notifications, toggleNotification }
}

export function useActiveNotificationState(notificationKey) {
  const notifications = useAtomValue(notificationsAtom)
  return notifications[notificationKey]
}

export function useNotificationState(notificationKey) {
  const [notifications, setNotifications] = useAtom(notificationsAtom)

  const toggleNotification = () => {
    setNotifications((prevNotifications) => ({
      ...prevNotifications,
      [notificationKey]: !prevNotifications[notificationKey],
    }))
  }

  return { notificationState: notifications[notificationKey], toggleNotification }
}
