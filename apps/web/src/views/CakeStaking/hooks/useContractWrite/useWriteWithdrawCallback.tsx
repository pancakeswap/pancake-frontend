import { useVeCakeContract } from 'hooks/useContract'
import { useCallback } from 'react'
import { useAccount, useSendTransaction } from 'wagmi'
import { useSetAtom } from 'jotai'
import { approveAndLockStatusAtom, cakeLockTxHashAtom, ApproveAndLockStatus } from 'state/vecake/atoms'
import { usePublicNodeWaitForTransaction } from 'hooks/usePublicNodeWaitForTransaction'
import { encodeFunctionData, zeroAddress } from 'viem'
import { EncodeFunctionDataParameters } from 'viem/_types/utils/abi/encodeFunctionData'

// invoke the lock function on the vecake contract
export const useWriteWithdrawCallback = () => {
  const veCakeContract = useVeCakeContract()
  const { address: account } = useAccount()
  const setStatus = useSetAtom(approveAndLockStatusAtom)
  const setTxHash = useSetAtom(cakeLockTxHashAtom)
  const { waitForTransaction } = usePublicNodeWaitForTransaction()
  const { sendTransactionAsync } = useSendTransaction()

  const withdraw = useCallback(async () => {
    const { request } = await veCakeContract.simulate.withdrawAll([zeroAddress], {
      account: account!,
      chain: veCakeContract.chain,
    })

    setStatus(ApproveAndLockStatus.UNLOCK_CAKE)

    const { hash } = await sendTransactionAsync({
      account,
      to: request.address,
      chainId: veCakeContract?.chain?.id,
      data: encodeFunctionData({
        abi: request.abi,
        functionName: request.functionName,
        args: request.args,
      } as unknown as EncodeFunctionDataParameters),
      gas: request.gas,
      gasPrice: request.gasPrice,
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
  }, [veCakeContract, account, setStatus, setTxHash, waitForTransaction, sendTransactionAsync])

  return withdraw
}
