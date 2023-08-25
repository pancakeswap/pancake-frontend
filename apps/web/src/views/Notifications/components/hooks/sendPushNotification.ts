import { useToast } from '@pancakeswap/uikit'
import { DEFAULT_PROJECT_ID, DEFAULT_RELAY_URL, PancakeNotifications } from 'views/Notifications/constants'
import { BuilderNames, NotificationPayload } from 'views/Notifications/types'
import useFormattedEip155Account from './useFormatEip155Account'

type NotifyResponse = { sent: string[]; failed: string[]; not_found: string[] }
interface IUseSendNotification {
  sendPushNotification: (notificationType: BuilderNames, args?: string[]) => Promise<void>
  sendBrowserNotification(title: string, body: string): Promise<void>
  subscribeToPushNotifications(): Promise<void>
  requestNotificationPermission: () => Promise<void | NotificationPermission>
}
const publicVapidKey = 'BFEZ07DxapGRLITs13MKaqFPmmbKoHgNLUDn-8aFjF4eitQypUHHsYyx39RSaYvQAxWgz18zvGOXsXw0y8_WxTY'

const useSendPushNotification = (): IUseSendNotification => {
  const { eip155Account } = useFormattedEip155Account()
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

        await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: publicVapidKey,
        })
      } catch (error) {
        throw new Error('Error:', error)
      }
    }
  }

  async function sendBrowserNotification(title: string, body: string) {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()
        if (subscription) {
          await fetch('http://localhost:8000/send-notification', {
            method: 'POST',
            body: JSON.stringify({ payload: { title, body }, subscription }),
            headers: { 'Content-Type': 'application/json' },
          })
        } else {
          await subscribeToPushNotifications()
        }
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
      const notifyResponse = await fetch(`${DEFAULT_RELAY_URL}/d460b3b88b735222abe849b3d43ed8e4/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${'dea2d1c0-4f90-4f4e-b0a4-09e84d52b0ee'}`,
        },
        body: JSON.stringify(notificationPayload),
      })

      const result: NotifyResponse = await notifyResponse.json()
      console.log('resultttt', result)
      const success = result.sent.includes(eip155Account as string)

      if (!success) {
        toast.toastError('Failed to send', 'Failed to send push notification as account was not found')
      } else {
        await sendBrowserNotification(notificationPayload.notification.title, notificationPayload.notification.body)
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.toastError('Failed to send', error.message)
      }
    }
  }
  return { sendPushNotification, sendBrowserNotification, subscribeToPushNotifications, requestNotificationPermission }
}

export default useSendPushNotification
