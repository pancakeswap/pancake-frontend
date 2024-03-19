import { useActiveChainId } from 'hooks/useActiveChainId'
import { useVeCakeContract } from 'hooks/useContract'
import { usePublicNodeWaitForTransaction } from 'hooks/usePublicNodeWaitForTransaction'
import { useSetAtom } from 'jotai'
import { useCallback } from 'react'
import {
  ApproveAndLockStatus,
  approveAndLockStatusAtom,
  cakeLockTxHashAtom,
  cakeLockWeeksAtom,
} from 'state/vecake/atoms'
import { useLockCakeData } from 'state/vecake/hooks'
import { logger } from 'utils/datadog'
import { logTx } from 'utils/log'
import { isUserRejected } from 'utils/sentry'
import { TransactionExecutionError } from 'viem'
import { useAccount, useWalletClient } from 'wagmi'
import { useRoundedUnlockTimestamp } from '../useRoundedUnlockTimestamp'
import { useCakeLockStatus } from '../useVeCakeUserInfo'

export const useWriteIncreaseLockWeeksCallback = (onDismiss?: () => void) => {
  const { chainId } = useActiveChainId()
  const veCakeContract = useVeCakeContract()
  const { cakeUnlockTime, cakeLockExpired } = useCakeLockStatus()
  const { address: account } = useAccount()
  const { cakeLockWeeks } = useLockCakeData()
  const setStatus = useSetAtom(approveAndLockStatusAtom)
  const setTxHash = useSetAtom(cakeLockTxHashAtom)
  const setCakeLockWeeks = useSetAtom(cakeLockWeeksAtom)
  const { data: walletClient } = useWalletClient()
  const { waitForTransaction } = usePublicNodeWaitForTransaction()
  const roundedUnlockTimestamp = useRoundedUnlockTimestamp(cakeLockExpired ? undefined : Number(cakeUnlockTime))

  const increaseLockWeeks = useCallback(async () => {
    const week = Number(cakeLockWeeks)
    if (!week || !roundedUnlockTimestamp || !account) return

    try {
      const { request } = await veCakeContract.simulate.increaseUnlockTime([roundedUnlockTimestamp], {
        account: account!,
        chain: veCakeContract.chain,
      })

      setStatus(ApproveAndLockStatus.INCREASE_WEEKS)

      const hash = await walletClient?.writeContract({
        ...request,
        account,
      })
      setTxHash(hash ?? '')
      setStatus(ApproveAndLockStatus.INCREASE_WEEKS_PENDING)
      if (hash) {
        const transactionReceipt = await waitForTransaction({ hash })
        logTx({ account, chainId: chainId!, hash })
        if (transactionReceipt?.status === 'success') {
          setCakeLockWeeks('')
          setStatus(ApproveAndLockStatus.CONFIRMED)
          onDismiss?.()
        } else {
          setStatus(ApproveAndLockStatus.ERROR)
        }
      }
    } catch (error: any) {
      console.error('Failed to increase lock weeks', error)
      if (isUserRejected(error)) {
        setStatus(ApproveAndLockStatus.REJECT)
      } else {
        logger.warn(
          '[CakeStaking]: Failed to increase lock weeks',
          {
            error: error instanceof TransactionExecutionError ? error.cause : undefined,
            account,
            chainId,
            cakeLockWeeks,
            roundedUnlockTimestamp,
          },
          error,
        )
        setStatus(ApproveAndLockStatus.ERROR)
      }
    }
  }, [
    cakeLockWeeks,
    roundedUnlockTimestamp,
    account,
    veCakeContract.simulate,
    veCakeContract.chain,
    setStatus,
    walletClient,
    setTxHash,
    waitForTransaction,
    chainId,
    setCakeLockWeeks,
    onDismiss,
  ])

  return increaseLockWeeks
}
