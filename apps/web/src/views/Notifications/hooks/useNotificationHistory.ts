import { useNotifications } from '@web3inbox/react'
import noop from 'lodash/noop'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useAppDispatch } from 'state'
import { setHasUnread } from 'state/notifications/actions'
import { useHasUnreadNotifications } from 'state/notifications/hooks'

const useNotificationHistory = (subscriptionId: string | undefined) => {
  const dispatch = useAppDispatch()
  const { unreadLength: hasUnread, unreadNotificationKeys } = useHasUnreadNotifications(subscriptionId)

  const containerRef = useRef<HTMLDivElement>(null)
  const { data: notifications, fetchNextPage, isLoadingNextPage, hasMore } = useNotifications(5, true)

  const isLoading = useMemo(() => Boolean(isLoadingNextPage && hasMore), [isLoadingNextPage, hasMore])

  const markAllNotificationsAsRead = useCallback(() => {
    if (!subscriptionId || !unreadNotificationKeys) return
    for (const unreadNotification of unreadNotificationKeys) {
      dispatch(setHasUnread({ subscriptionId, notificationId: unreadNotification, hasUnread: true }))
    }
  }, [dispatch, subscriptionId, unreadNotificationKeys])

  const markAsRead = useCallback(
    (value: boolean, id: string) => {
      if (!subscriptionId) return
      dispatch(setHasUnread({ subscriptionId, notificationId: id, hasUnread: value }))
    },
    [dispatch, subscriptionId],
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container) return noop()

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const isAtBottom = scrollTop + clientHeight >= scrollHeight * 0.97
      if (isAtBottom && hasMore) fetchNextPage()
    }

    container.addEventListener('scroll', handleScroll)
    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [containerRef, fetchNextPage, hasMore])

  return { notifications, containerRef, isLoading, markAllNotificationsAsRead, markAsRead, hasUnread }
}

export default useNotificationHistory
