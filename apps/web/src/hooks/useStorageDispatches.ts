import { useMemo } from 'react'
import { useTransactionState } from 'state/transactions/reducer'
import { useUserState } from 'state/user/reducer'
import { useNotificationsState } from 'state/notifications/reducer'

const useStorageDispatches = () => {
  const [, transactionState] = useTransactionState()
  const [, userState] = useUserState()
  const [, notificationState] = useNotificationsState()

  return useMemo(
    () => [transactionState, userState, notificationState],
    [transactionState, userState, notificationState],
  )
}

export default useStorageDispatches
