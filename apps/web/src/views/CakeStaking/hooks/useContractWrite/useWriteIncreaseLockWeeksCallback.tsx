import { MAX_VECAKE_LOCK_WEEKS } from 'config/constants/veCake'
import dayjs from 'dayjs'
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
import { useCurrentBlockTimestamp } from '../useCurrentBlockTimestamp'
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
  const currentTimestamp = useCurrentBlockTimestamp()

  const increaseLockWeeks = useCallback(async () => {
    const startTime = cakeLockExpired ? dayjs.unix(currentTimestamp) : dayjs.unix(Number(cakeUnlockTime))
    const maxUnlockTime = dayjs.unix(currentTimestamp).add(MAX_VECAKE_LOCK_WEEKS, 'weeks')
    const userUnlockTime = startTime.add(Number(cakeLockWeeks), 'weeks')
    const unlockTime = userUnlockTime.isAfter(maxUnlockTime) ? maxUnlockTime : userUnlockTime
    const { request } = await veCakeContract.simulate.increaseUnlockTime([BigInt(unlockTime.unix())], {
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
    cakeLockExpired,
    currentTimestamp,
    cakeUnlockTime,
    veCakeContract.simulate,
    veCakeContract.chain,
    cakeLockWeeks,
    account,
    setStatus,
    walletClient,
    setTxHash,
    waitForTransaction,
    setCakeLockWeeks,
  ])

  return increaseLockWeeks
}
