import { useVeCakeContract } from 'hooks/useContract'
import { usePublicNodeWaitForTransaction } from 'hooks/usePublicNodeWaitForTransaction'
import { useSetAtom } from 'jotai'
import { useCallback } from 'react'
import { ApproveAndLockStatus, approveAndLockStatusAtom, cakeLockTxHashAtom } from 'state/vecake/atoms'
import { calculateGasMargin } from 'utils'
import { useAccount, useWalletClient } from 'wagmi'
import { useGasPrice } from 'state/user/hooks'

export const useWriteMigrateCallback = () => {
  const veCakeContract = useVeCakeContract()
  const { address: account } = useAccount()
  const setStatus = useSetAtom(approveAndLockStatusAtom)
  const setTxHash = useSetAtom(cakeLockTxHashAtom)
  const { data: walletClient } = useWalletClient()
  const gasPrice = useGasPrice()
  const { waitForTransaction } = usePublicNodeWaitForTransaction()

  const lockCake = useCallback(async () => {
    const { request } = await veCakeContract.simulate.migrateFromCakePool({
      account: account!,
      chain: veCakeContract.chain,
      gasPrice,
    })

    setStatus(ApproveAndLockStatus.MIGRATE)

    const hash = await walletClient?.writeContract({
      ...request,
      gas: request.gas ? calculateGasMargin(request.gas) : undefined,
      account,
    })
    setTxHash(hash ?? '')
    setStatus(ApproveAndLockStatus.MIGRATE_PENDING)
    if (hash) {
      const transactionReceipt = await waitForTransaction({ hash })
      if (transactionReceipt?.status === 'success') {
        setStatus(ApproveAndLockStatus.CONFIRMED)
      } else {
        setStatus(ApproveAndLockStatus.ERROR)
      }
    }
  }, [veCakeContract, account, setStatus, setTxHash, waitForTransaction, walletClient, gasPrice])

  return lockCake
}
