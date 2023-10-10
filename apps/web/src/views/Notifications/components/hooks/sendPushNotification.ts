import { useToast } from '@pancakeswap/uikit'
import crypto from 'crypto'
import {
  DEFAULT_RELAY_URL,
  PancakeNotifications,
  WEB_PUSH_ENCRYPTION_KEY,
  WEB_PUSH_IV,
} from 'views/Notifications/constants'
import { BuilderNames, NotificationPayload } from 'views/Notifications/types'
import { useAccount } from 'wagmi'
import useRegistration from './useRegistration'

interface IUseSendNotification {
  sendPushNotification: (notificationType: BuilderNames, args?: string[]) => Promise<void>
  subscribeToPushNotifications(): Promise<void>
  requestNotificationPermission: () => Promise<void | NotificationPermission>
}

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

        const secretKeyBuffer = Buffer.from(WEB_PUSH_ENCRYPTION_KEY, 'hex')
        const ivBuffer = Buffer.from(WEB_PUSH_IV, 'hex')

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_KEY,
        })

        const data = JSON.stringify(subscription)
        const cipher = crypto.createCipheriv('aes-256-cbc', secretKeyBuffer, ivBuffer)

        let encryptedData = cipher.update(data, 'utf8', 'hex')
        encryptedData += cipher.final('hex')

        await fetch('http://localhost:8000./subscribe', {
          method: 'POST',
          body: JSON.stringify({ subscription: encryptedData, user: account }),
          headers: { 'Content-Type': 'application/json' },
        })
      } catch (error) {
        console.error('failed to subscribe to push notis', error)
      }
    }
  }

  const sendPushNotification = async (notificationType: BuilderNames, args: string[]) => {
    if (!eip155Account) return
    const notificationPayload: NotificationPayload = {
      accounts: [eip155Account],
      notification: PancakeNotifications[notificationType](args),
    }
    try {
      await fetch(`http://localhost:8000/walletconnect-notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-secure-token': process.env.SECURE_TOKEN as string,
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
