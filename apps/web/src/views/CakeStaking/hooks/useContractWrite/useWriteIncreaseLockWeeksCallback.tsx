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
import { useAccount, useWalletClient } from 'wagmi'
import { useRoundedUnlockTimestamp } from '../useRoundedUnlockTimestamp'
import { useCakeLockStatus } from '../useVeCakeUserInfo'

export const useWriteIncreaseLockWeeksCallback = () => {
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
    if (!week || !roundedUnlockTimestamp) return

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
      await waitForTransaction({ hash })
      setCakeLockWeeks('')
    }
    setStatus(ApproveAndLockStatus.CONFIRMED)
  }, [
    cakeLockWeeks,
    veCakeContract.simulate,
    veCakeContract.chain,
    roundedUnlockTimestamp,
    account,
    setStatus,
    walletClient,
    setTxHash,
    waitForTransaction,
    setCakeLockWeeks,
  ])

  return increaseLockWeeks
}
