import { useTranslation } from '@pancakeswap/localization'
import { Toggle, useToast } from '@pancakeswap/uikit'
import { useSubscription, useUnsubscribe } from '@web3inbox/react'
import { useCallback, useMemo } from 'react'
import { useAllowNotifications } from 'state/notifications/hooks'
import { Events } from 'views/Notifications/constants'
import { parseErrorMessage } from 'views/Notifications/utils/errorBuilder'

export const useWebNotificationsToggle = () => {
  const { t } = useTranslation()
  const { data: subscription } = useSubscription()
  const isSubscribed = useMemo(() => Boolean(subscription), [subscription])
  const { unsubscribe } = useUnsubscribe()
  const [allowNotifications, setAllowNotifications] = useAllowNotifications()
  const toast = useToast()

  const handleDisableNotifications = useCallback(async () => {
    try {
      if (isSubscribed) await unsubscribe()
      setAllowNotifications(false)
      toast.toastSuccess(Events.Unsubscribed.title(t), Events.Unsubscribed.message?.(t))
    } catch (error) {
      const errMessage = parseErrorMessage(Events.UnsubscribeError, error)
      toast.toastWarning(Events.UnsubscribeError.title(t), errMessage)
    }
  }, [t, isSubscribed, setAllowNotifications, toast, unsubscribe])

  const handleEnableNotifications = useCallback(async () => {
    try {
      setAllowNotifications(true)
      toast.toastSuccess(Events.NotificationsEnabled.title(t), Events.NotificationsEnabled.message?.(t))
    } catch (error) {
      const errMessage = parseErrorMessage(Events.NotificationsEnabledError, error)
      toast.toastWarning(Events.NotificationsEnabledError.title(t), errMessage)
    }
  }, [t, setAllowNotifications, toast])

  const toggle = useCallback(
    () => (allowNotifications ? handleDisableNotifications() : handleEnableNotifications()),
    [allowNotifications, handleDisableNotifications, handleEnableNotifications],
  )

  return { allowNotifications, isSubscribed, toggle }
}

function WebNotiToggle({ enabled }) {
  const { toggle } = useWebNotificationsToggle()
  return <Toggle id="toggle-webnoti" checked={enabled} scale="md" onChange={toggle} />
}

export default WebNotiToggle
