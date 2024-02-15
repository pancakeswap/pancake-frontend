import { useVeCakeContract } from 'hooks/useContract'
import { useCallback } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { useSetAtom } from 'jotai'
import { approveAndLockStatusAtom, cakeLockTxHashAtom, ApproveAndLockStatus } from 'state/vecake/atoms'
import { usePublicNodeWaitForTransaction } from 'hooks/usePublicNodeWaitForTransaction'
import { zeroAddress } from 'viem'

// invoke the lock function on the vecake contract
export const useWriteWithdrawCallback = () => {
  const veCakeContract = useVeCakeContract()
  const { address: account } = useAccount()
  const setStatus = useSetAtom(approveAndLockStatusAtom)
  const setTxHash = useSetAtom(cakeLockTxHashAtom)
  const { data: walletClient } = useWalletClient()
  const { waitForTransaction } = usePublicNodeWaitForTransaction()

  const withdraw = useCallback(async () => {
    const { request } = await veCakeContract.simulate.withdrawAll([zeroAddress], {
      account: account!,
      chain: veCakeContract.chain,
    })

    setStatus(ApproveAndLockStatus.UNLOCK_CAKE)

    const hash = await walletClient?.writeContract({
      ...request,
      account,
    })
    setTxHash(hash ?? '')
    setStatus(ApproveAndLockStatus.UNLOCK_CAKE_PENDING)
    if (hash) {
      const transactionReceipt = await waitForTransaction({ hash })
      if (transactionReceipt?.status === 'success') {
        setStatus(ApproveAndLockStatus.CONFIRMED)
      } else {
        setStatus(ApproveAndLockStatus.ERROR)
      }
    }
  }, [veCakeContract, account, setStatus, setTxHash, waitForTransaction, walletClient])

  return withdraw
}
