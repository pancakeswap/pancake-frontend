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
    // @fixme @ChefJerry
    // const { request } = await veCakeContract.simulate.withdrawAll([zeroAddress], {
    //   account: account!,
    //   chain: veCakeContract.chain,
    // })
    const { request } = await veCakeContract.simulate.earlyWithdraw([zeroAddress, BigInt(1e18)], {
      account: account!,
      chain: veCakeContract.chain,
    })

    setStatus(ApproveAndLockStatus.UNLOCK_CAKE)

    const hash = await walletClient?.writeContract(request)
    setTxHash(hash)
    setStatus(ApproveAndLockStatus.UNLOCK_CAKE_PENDING)
    if (hash) {
      await waitForTransaction({ hash })
    }
    setStatus(ApproveAndLockStatus.CONFIRMED)
  }, [veCakeContract, account, setStatus, setTxHash, waitForTransaction, walletClient])

  return withdraw
}
