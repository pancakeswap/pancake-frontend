import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import BN from 'bignumber.js'
import { useVeCakeContract } from 'hooks/useContract'
import { usePublicNodeWaitForTransaction } from 'hooks/usePublicNodeWaitForTransaction'
import { useSetAtom } from 'jotai'
import { useCallback } from 'react'
import { ApproveAndLockStatus, approveAndLockStatusAtom, cakeLockTxHashAtom } from 'state/vecake/atoms'
import { useLockCakeData } from 'state/vecake/hooks'
import { calculateGasMargin } from 'utils'
import { useAccount, useWalletClient } from 'wagmi'
import { useRoundedUnlockTimestamp } from '../useRoundedUnlockTimestamp'

// invoke the lock function on the vecake contract
export const useWriteLockCallback = () => {
  const veCakeContract = useVeCakeContract()
  const { address: account } = useAccount()
  const { cakeLockAmount, cakeLockWeeks } = useLockCakeData()
  const setStatus = useSetAtom(approveAndLockStatusAtom)
  const setTxHash = useSetAtom(cakeLockTxHashAtom)
  const { data: walletClient } = useWalletClient()
  const { waitForTransaction } = usePublicNodeWaitForTransaction()
  const roundedUnlockTimestamp = useRoundedUnlockTimestamp()

  const lockCake = useCallback(async () => {
    const week = Number(cakeLockWeeks)
    if (!week || !cakeLockAmount || !roundedUnlockTimestamp) return

    const { request } = await veCakeContract.simulate.createLock(
      [BigInt(getDecimalAmount(new BN(cakeLockAmount), 18).toString()), roundedUnlockTimestamp],
      {
        account: account!,
        chain: veCakeContract.chain,
      },
    )

    setStatus(ApproveAndLockStatus.LOCK_CAKE)

    const hash = await walletClient?.writeContract({
      ...request,
      gas: request.gas ? calculateGasMargin(request.gas) : undefined,
      account,
    })
    setTxHash(hash ?? '')
    setStatus(ApproveAndLockStatus.LOCK_CAKE_PENDING)
    if (hash) {
      const transactionReceipt = await waitForTransaction({ hash })
      if (transactionReceipt?.status === 'success') {
        setStatus(ApproveAndLockStatus.CONFIRMED)
      } else {
        setStatus(ApproveAndLockStatus.ERROR)
      }
    }
  }, [
    cakeLockWeeks,
    cakeLockAmount,
    roundedUnlockTimestamp,
    veCakeContract.simulate,
    veCakeContract.chain,
    account,
    setStatus,
    walletClient,
    setTxHash,
    waitForTransaction,
  ])

  return lockCake
}
