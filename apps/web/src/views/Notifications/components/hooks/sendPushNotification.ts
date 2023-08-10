import {
  DEFAULT_CAST_SIGN_KEY,
  DEFAULT_PROJECT_ID,
  DEFAULT_RELAY_URL,
  PancakeNotifications,
} from 'views/Notifications/constants'
import { BuilderNames, NotificationPayload } from 'views/Notifications/types'
import useFormattedEip155Account from './useFormatEip155Account'

type NotifyResponse = { sent: string[]; failed: string[]; not_found: string[] }
interface IUseSendNotification {
  sendPushNotification: (notificationType: BuilderNames, args?: string[]) => Promise<void>
}

const useSendPushNotification = (): IUseSendNotification => {
  const { formattedEip155Account } = useFormattedEip155Account()

  const sendPushNotification = async (notificationType: BuilderNames, args?: string[]) => {
    const notificationPayload: NotificationPayload = {
      accounts: [formattedEip155Account],
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
      const success = result.sent.includes(formattedEip155Account)

      if (!success) {
        // NO access to toaster yet
      }
    } catch (error) {
      if (error instanceof Error) {
        //
      }
    }
  }
  return { sendPushNotification }
}

export default useSendPushNotification
