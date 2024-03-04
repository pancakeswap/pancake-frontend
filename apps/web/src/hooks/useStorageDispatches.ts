import { useMemo } from 'react'
import { useTransactionState } from 'state/transactions/reducer'
import { useUserState } from 'state/user/reducer'
import { useNotificationsState } from 'state/notifications/reducer'
import { useAppDispatch } from 'state'

export enum StorageDispatchTypes {
  APP,
  TRANSACTION,
  USER,
  NOTIFICATION,
}

const useStorageDispatches = () => {
  const dispatch = useAppDispatch()
  const [, transactionDispatch] = useTransactionState()
  const [, userDispatch] = useUserState()
  const [, notificationDispatch] = useNotificationsState()

  return useMemo(
    () => ({
      [StorageDispatchTypes.APP]: dispatch,
      [StorageDispatchTypes.TRANSACTION]: transactionDispatch,
      [StorageDispatchTypes.USER]: userDispatch,
      [StorageDispatchTypes.NOTIFICATION]: notificationDispatch,
    }),
    [dispatch, transactionDispatch, userDispatch, notificationDispatch],
  )
}

export default useStorageDispatches
