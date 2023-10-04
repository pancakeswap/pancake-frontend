import { useToast } from '@pancakeswap/uikit'
import {
  DEFAULT_CAST_SIGN_KEY,
  DEFAULT_PROJECT_ID,
  DEFAULT_RELAY_URL,
  PancakeNotifications,
} from 'views/Notifications/constants'
import { BuilderNames, NotificationPayload } from 'views/Notifications/types'
import { useAccount } from 'wagmi'
import useRegistration from './useRegistration'

interface IUseSendNotification {
  sendPushNotification: (notificationType: BuilderNames, args?: string[]) => Promise<void>
  subscribeToPushNotifications(): Promise<void>
  requestNotificationPermission: () => Promise<void | NotificationPermission>
}
const publicVapidKey = 'BFEZ07DxapGRLITs13MKaqFPmmbKoHgNLUDn-8aFjF4eitQypUHHsYyx39RSaYvQAxWgz18zvGOXsXw0y8_WxTY'

const useSendPushNotification = (): IUseSendNotification => {
  const { address: account } = useAccount()
  const { account: eip155Account } = useRegistration()
  const toast = useToast()

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      return Promise.reject(new Error('This browser does not support desktop push notifications'))
    }
    switch (Notification.permission) {
      case 'granted':
        return Promise.resolve()
      case 'denied':
        return Promise.reject(new Error('User does not want to receive notifications'))
      default:
        return Notification.requestPermission()
    }
  }

  async function subscribeToPushNotifications() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker-sw.js')
        await navigator.serviceWorker.ready

        const existingSubscription = await registration.pushManager.getSubscription()
        if (existingSubscription) return

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: publicVapidKey,
        })
        await fetch('http://localhost:8000/subscribe', {
          method: 'POST',
          body: JSON.stringify({ subscription, user: account }),
          headers: { 'Content-Type': 'application/json' },
        })
      } catch (error) {
        throw new Error('Error:', error)
      }
    }
  }

  const sendPushNotification = async (notificationType: BuilderNames, args?: string[]) => {
    const notificationPayload: NotificationPayload = {
      accounts: [eip155Account],
      notification: PancakeNotifications[notificationType](args),
    }
    try {
      await fetch(`${DEFAULT_RELAY_URL}/${DEFAULT_PROJECT_ID}/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${'03533e45-782a-42fb-820d-c0984ed392d9'}`,
        },
        body: JSON.stringify(notificationPayload),
      })
    } catch (error) {
      if (error instanceof Error) {
        toast.toastError('Failed to send', error.message)
      }
    }
  }
  return { sendPushNotification, subscribeToPushNotifications, requestNotificationPermission }
}

export default useSendPushNotification
