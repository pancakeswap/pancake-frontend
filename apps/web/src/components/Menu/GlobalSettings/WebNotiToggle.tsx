import { Toggle, useToast } from '@pancakeswap/uikit'
import { useManageSubscription, useW3iAccount } from '@web3inbox/widget-react'
import { useCallback } from 'react'
import { useAllowNotifications } from 'state/notifications/hooks'
import { Events } from 'views/Notifications/constants'
import { parseErrorMessage } from 'views/Notifications/utils/errorBuilder'

const useWebNotificationsToggle = () => {
  const { account } = useW3iAccount()
  const { unsubscribe, isSubscribed } = useManageSubscription(account)
  const [allowNotifications, setAllowNotifications] = useAllowNotifications()
  const toast = useToast()

  const handleDiableNotifications = useCallback(async () => {
    try {
      if (isSubscribed) await unsubscribe()
      setAllowNotifications(false)
      toast.toastSuccess(Events.Unsubscribed.title, Events.Unsubscribed.message?.())
    } catch (error) {
      const errMessage = parseErrorMessage(Events.UnsubscribeError, error)
      toast.toastWarning(Events.UnsubscribeError.title, errMessage)
    }
  }, [isSubscribed, setAllowNotifications, toast, unsubscribe])

  const handleEnableNotifications = useCallback(async () => {
    try {
      setAllowNotifications(true)
      toast.toastSuccess(Events.NotificationsEnabled.title, Events.NotificationsEnabled.message?.())
    } catch (error) {
      const errMessage = parseErrorMessage(Events.NotificationsEnabledError, error)
      toast.toastWarning(Events.NotificationsEnabledError.title, errMessage)
    }
  }, [setAllowNotifications, toast])

  const toggle = useCallback(
    () => (allowNotifications ? handleDiableNotifications() : handleEnableNotifications()),
    [allowNotifications, handleDiableNotifications, handleEnableNotifications],
  )

  return toggle
}

function WebNotiToggle({ enabled }) {
  const toggle = useWebNotificationsToggle()
  return <Toggle id="toggle-webnoti" checked={enabled} scale="md" onChange={toggle} />
}

export default WebNotiToggle
