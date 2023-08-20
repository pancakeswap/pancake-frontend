import { useToast } from '@pancakeswap/uikit'
import { DEFAULT_PROJECT_ID, DEFAULT_RELAY_URL, PancakeNotifications } from 'views/Notifications/constants'
import { BuilderNames, NotificationPayload } from 'views/Notifications/types'
import useFormattedEip155Account from './useFormatEip155Account'

type NotifyResponse = { sent: string[]; failed: string[]; not_found: string[] }
interface IUseSendNotification {
  sendPushNotification: (notificationType: BuilderNames, args?: string[]) => Promise<void>
}

const useSendPushNotification = (): IUseSendNotification => {
  const { eip155Account } = useFormattedEip155Account()
  const toast = useToast()

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
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.toastError('Failed to send', error.message)
      }
    }
  }
  return { sendPushNotification }
}

export default useSendPushNotification
