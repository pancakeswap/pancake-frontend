import { NOTIFICATION_HUB_BASE_URL } from 'config/constants/endpoints'
import crypto from 'crypto'
import { PUBLIC_VAPID_KEY, WEB_PUSH_ENCRYPTION_KEY, WEB_PUSH_IV } from 'views/Notifications/constants'
import { useAccount } from 'wagmi'

interface IUseSendNotification {
  subscribeToWebPush: () => Promise<void>
}

const useSubscribeToWebPushNotifications = (): IUseSendNotification => {
  const { address } = useAccount()

  async function subscribeToWebPush() {
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

  return { subscribeToWebPush }
}

export default useSubscribeToWebPushNotifications
