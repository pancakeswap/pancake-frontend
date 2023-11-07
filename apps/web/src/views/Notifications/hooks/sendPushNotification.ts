import { useToast } from '@pancakeswap/uikit'
import { PancakeNotifications, SECURE_TOKEN } from 'views/Notifications/constants'
import { BuilderNames, NotificationPayload } from 'views/Notifications/types'

interface IUseSendNotification {
  sendPushNotification: (notificationType: BuilderNames, args: string[], account: string) => Promise<void>
}

const useSendPushNotification = (): IUseSendNotification => {
  const toast = useToast()

  const sendPushNotification = async (notificationType: BuilderNames, args: string[], account: string) => {
    const notificationPayload: NotificationPayload = {
      accounts: [account],
      notification: PancakeNotifications[notificationType](args),
    }
    try {
      await fetch(`https://lobster-app-6lfpi.ondigitalocean.app/walletconnect-notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-secure-token': SECURE_TOKEN,
        },
        body: JSON.stringify(notificationPayload),
      })
    } catch (error) {
      if (error instanceof Error) {
        toast.toastError('Failed to send', error.message)
      }
    }
  }
  return { sendPushNotification }
}

export default useSendPushNotification
