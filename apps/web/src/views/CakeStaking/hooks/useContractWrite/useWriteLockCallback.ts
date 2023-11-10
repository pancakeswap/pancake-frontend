import { useVeCakeContract } from 'hooks/useContract'
import { useCallback } from 'react'
import BN from 'bignumber.js'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import dayjs from 'dayjs'
import { useAccount, useWalletClient } from 'wagmi'
import { useLockCakeData } from 'state/vecake/hooks'
import { useSetAtom } from 'jotai'
import { approveAndLockStatusAtom, cakeLockTxHashAtom, ApproveAndLockStatus } from 'state/vecake/atoms'
import { usePublicNodeWaitForTransaction } from 'hooks/usePublicNodeWaitForTransaction'

// invoke the lock function on the vecake contract
export const useWriteLockCallback = () => {
  const veCakeContract = useVeCakeContract()
  const { address: account } = useAccount()
  const { cakeLockAmount, cakeLockWeeks } = useLockCakeData()
  const setStatus = useSetAtom(approveAndLockStatusAtom)
  const setTxHash = useSetAtom(cakeLockTxHashAtom)
  const { data: walletClient } = useWalletClient()
  const { waitForTransaction } = usePublicNodeWaitForTransaction()

  const lockCake = useCallback(async () => {
    const { request } = await veCakeContract.simulate.createLock(
      [
        BigInt(getDecimalAmount(new BN(cakeLockAmount), 18).toString()),
        BigInt(dayjs().add(Number(cakeLockWeeks), 'week').unix()),
      ],
      {
        account: account!,
        chain: veCakeContract.chain,
      },
    )

    setStatus(ApproveAndLockStatus.LOCK_CAKE)

    const hash = await walletClient?.writeContract(request)
    setTxHash(hash)
    setStatus(ApproveAndLockStatus.LOCK_CAKE_PENDING)
    if (hash) {
      await waitForTransaction({ hash })
    }
    setStatus(ApproveAndLockStatus.CONFIRMED)
  }, [veCakeContract, cakeLockAmount, cakeLockWeeks, account, setStatus, setTxHash, waitForTransaction, walletClient])

  return lockCake
}
