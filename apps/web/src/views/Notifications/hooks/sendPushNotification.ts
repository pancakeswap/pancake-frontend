import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import { NOTIFICATION_HUB_BASE_URL } from 'config/constants/endpoints'
import crypto from 'crypto'
import {
  NEXT_PUBLIC_WEB_NOTIFICATION_SECURE_TOKEN,
  PUBLIC_VAPID_KEY,
  PancakeNotifications,
  WEB_PUSH_ENCRYPTION_KEY,
  WEB_PUSH_IV,
} from 'views/Notifications/constants'
import { BuilderNames, NotificationPayload } from 'views/Notifications/types'
import { useAccount } from 'wagmi'

interface IUseSendNotification {
  sendPushNotification: (notificationType: BuilderNames, args: string[], account: string) => Promise<void>
  requestNotificationPermission: () => Promise<void | NotificationPermission>
  subscribeToPushNotifications(): Promise<void>
}

const useSendPushNotification = (): IUseSendNotification => {
  const toast = useToast()
  const { address } = useAccount()
  const { t } = useTranslation()

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

        if (existingSubscription) {
          // Unsubscribe the user from the existing subscription // fixes broken subscription
          await existingSubscription.unsubscribe()
        }

        const secretKeyBuffer = Buffer.from(WEB_PUSH_ENCRYPTION_KEY, 'hex')
        const ivBuffer = Buffer.from(WEB_PUSH_IV, 'hex')

        const newSubscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: PUBLIC_VAPID_KEY,
        })

        const data = JSON.stringify(newSubscription)
        const cipher = crypto.createCipheriv('aes-256-cbc', secretKeyBuffer, ivBuffer)

        let encryptedData = cipher.update(data, 'utf8', 'hex')
        encryptedData += cipher.final('hex')

        await fetch(`${NOTIFICATION_HUB_BASE_URL}/subscribe`, {
          method: 'POST',
          body: JSON.stringify({ subscription: encryptedData, user: address }),
          headers: { 'Content-Type': 'application/json' },
        })
      } catch (error) {
        console.error('Failed to subscribe to push notifications', error)
      }
    }
  }

  const sendPushNotification = async (notificationType: BuilderNames, args: string[], account: string) => {
    const notificationPayload: NotificationPayload = {
      accounts: [`eip155:1:${account}`],
      notification: PancakeNotifications[notificationType](t, args),
    }
    try {
      await fetch(`${NOTIFICATION_HUB_BASE_URL}/walletconnect-notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-secure-token': NEXT_PUBLIC_WEB_NOTIFICATION_SECURE_TOKEN,
        },
        body: JSON.stringify(notificationPayload),
      })
    } catch (error) {
      if (error instanceof Error) {
        toast.toastError(t('Failed to send'), error.message)
      }
    }
  }
  return { sendPushNotification, requestNotificationPermission, subscribeToPushNotifications }
}

export default useSendPushNotification
