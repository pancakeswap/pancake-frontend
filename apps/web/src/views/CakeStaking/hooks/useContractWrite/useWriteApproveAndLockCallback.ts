import { ApprovalState } from 'hooks/useApproveCallback'
import { usePublicNodeWaitForTransaction } from 'hooks/usePublicNodeWaitForTransaction'
import { useSetAtom } from 'jotai'
import { useCallback } from 'react'
import { ApproveAndLockStatus, approveAndLockStatusAtom, cakeLockTxHashAtom } from 'state/vecake/atoms'
import { useLockCakeData, useLockCakeDataResetCallback } from 'state/vecake/hooks'
import { isUserRejected } from 'utils/sentry'
import { useLockApproveCallback } from '../useLockAllowance'
import { useWriteLockCallback } from './useWriteLockCallback'

export const useWriteApproveAndLockCallback = () => {
  const setTxHash = useSetAtom(cakeLockTxHashAtom)
  const setStatus = useSetAtom(approveAndLockStatusAtom)
  const { cakeLockAmount } = useLockCakeData()

  const lockCake = useWriteLockCallback()
  const { approvalState, approveCallback } = useLockApproveCallback(cakeLockAmount)
  const { waitForTransaction } = usePublicNodeWaitForTransaction()
  const resetData = useLockCakeDataResetCallback()

  const handleCancel = useCallback(() => {
    setStatus(ApproveAndLockStatus.IDLE)
  }, [setStatus])

  return useCallback(async () => {
    setTxHash(undefined)
    try {
      if (approvalState === ApprovalState.NOT_APPROVED) {
        setStatus(ApproveAndLockStatus.APPROVING_TOKEN)
        const { hash } = await approveCallback()
        if (hash) {
          await waitForTransaction({ hash })
        }
        setStatus(ApproveAndLockStatus.LOCK_CAKE)
        await lockCake()
        resetData()
        return
      }
      if (approvalState === ApprovalState.APPROVED) {
        await lockCake()
        resetData()
        return
      }
    } catch (error) {
      console.error(error)
      if (isUserRejected(error)) {
        handleCancel()
      }
    }
  }, [approvalState, approveCallback, handleCancel, lockCake, resetData, setStatus, setTxHash, waitForTransaction])
}
