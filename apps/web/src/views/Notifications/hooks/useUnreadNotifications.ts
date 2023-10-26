'use client'

import { NotifyClientTypes } from '@walletconnect/notify-client'
import { useMessages } from '@web3inbox/widget-react'
import { useEffect, useRef, useState } from 'react'

const useUnreadNotifications = () => {
  const [unread, setUnread] = useState<number>(Number(localStorage.getItem('unread')) - 1)
  const { messages: notifications } = useMessages()

  const currentNotificationsRef = useRef<NotifyClientTypes.NotifyMessageRecord[]>(notifications)

  useEffect(() => {
    if (notifications.length > currentNotificationsRef.current.length) {
      setUnread((prev: number) => prev + 1)
      currentNotificationsRef.current = notifications
    }
  }, [notifications, setUnread])

  useEffect(() => {
    localStorage.setItem('unread', unread.toString())
  }, [unread])

  return { unread, setUnread }
}

export default useUnreadNotifications
