import { useToast } from '@pancakeswap/uikit'
import { DEFAULT_PROJECT_ID, DEFAULT_RELAY_URL, PancakeNotifications } from 'views/Notifications/constants'
import { BuilderNames, NotificationPayload } from 'views/Notifications/types'
import useFormattedEip155Account from './useFormatEip155Account'

type NotifyResponse = { sent: string[]; failed: string[]; not_found: string[] }
interface IUseSendNotification {
  sendPushNotification: (notificationType: BuilderNames, args?: string[]) => Promise<void>
  sendBrowserNotification(title: string, body: string): Promise<void>
  subscribeToPushNotifications(): Promise<void>
}
const publicVapidKey = 'BFEZ07DxapGRLITs13MKaqFPmmbKoHgNLUDn-8aFjF4eitQypUHHsYyx39RSaYvQAxWgz18zvGOXsXw0y8_WxTY'

const useSendPushNotification = (): IUseSendNotification => {
  const { eip155Account } = useFormattedEip155Account()
  const toast = useToast()

  async function subscribeToPushNotifications() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker-sw.js')
        await navigator.serviceWorker.ready

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: publicVapidKey,
        })

        await fetch('http://localhost:8000/subscribe', {
          method: 'POST',
          body: JSON.stringify(subscription),
          headers: { 'Content-Type': 'application/json' },
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
      const notifyResponse = await fetch(`${DEFAULT_RELAY_URL}/${DEFAULT_PROJECT_ID}/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${'85a7792c-c5d7-486b-b37e-e752918e4866'}`,
        },
        body: JSON.stringify(notificationPayload),
      })

      const result: NotifyResponse = await notifyResponse.json()
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
  return { sendPushNotification, sendBrowserNotification, subscribeToPushNotifications }
}

export default useSendPushNotification
