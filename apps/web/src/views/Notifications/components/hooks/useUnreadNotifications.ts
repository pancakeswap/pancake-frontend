import { useEffect, useRef, useState } from 'react'
import { useMessages } from '@web3inbox/widget-react'
import { NotifyClientTypes } from '@walletconnect/notify-client'
import useRegistration from './useRegistration'

const useUnreadNotifications = () => {
  const [unread, setUnread] = useState<number>(0)
  const { account } = useRegistration()
  const { messages: notifications } = useMessages(account)

  const currentNotificationsRef = useRef<NotifyClientTypes.NotifyMessageRecord[]>(notifications)

  useEffect(() => {
    if (notifications.length > currentNotificationsRef.current.length) {
      setUnread((prev: number) => prev + 1)
      currentNotificationsRef.current = notifications
    }
  }, [notifications, setUnread])

  return { unread, setUnread }
}

export default useUnreadNotifications
