'use client'

import { NotifyClientTypes } from '@walletconnect/notify-client'
import { useMessages, useW3iAccount } from '@web3inbox/widget-react'
import { useEffect, useRef, useState } from 'react'

const useUnreadNotifications = () => {
  const { account } = useW3iAccount()
  const { messages: notifications } = useMessages(account)
  const [unread, setUnread] = useState<number>(Number(localStorage.getItem(`${account}-unread`)) - 1)

  const currentNotificationsRef = useRef<NotifyClientTypes.NotifyMessageRecord[]>(notifications)

  useEffect(() => {
    if (!notifications) return
    if (notifications.length > currentNotificationsRef.current.length) {
      setUnread((prev: number) => prev + 1)
      currentNotificationsRef.current = notifications
    }
    if (notifications.length === 0) setUnread(0)
  }, [notifications, setUnread, account])

  useEffect(() => {
    localStorage.setItem(`${account}-unread`, unread.toString())
  }, [unread, account])

  return { unread, setUnread }
}

export default useUnreadNotifications
