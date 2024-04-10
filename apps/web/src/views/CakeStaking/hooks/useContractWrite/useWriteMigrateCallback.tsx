import { useVeCakeContract } from 'hooks/useContract'
import { usePublicNodeWaitForTransaction } from 'hooks/usePublicNodeWaitForTransaction'
import { useSetAtom } from 'jotai'
import { useCallback } from 'react'
import { ApproveAndLockStatus, approveAndLockStatusAtom, cakeLockTxHashAtom } from 'state/vecake/atoms'
import { calculateGasMargin } from 'utils'
import { useAccount, useSendTransaction } from 'wagmi'
import { encodeFunctionData } from 'viem'
import { EncodeFunctionDataParameters } from 'viem/_types/utils/abi/encodeFunctionData'

export const useWriteMigrateCallback = () => {
  const veCakeContract = useVeCakeContract()
  const { address: account } = useAccount()
  const setStatus = useSetAtom(approveAndLockStatusAtom)
  const setTxHash = useSetAtom(cakeLockTxHashAtom)
  const { waitForTransaction } = usePublicNodeWaitForTransaction()
  const { sendTransactionAsync } = useSendTransaction()

  const lockCake = useCallback(async () => {
    const { request } = await veCakeContract.simulate.migrateFromCakePool({
      account: account!,
      chain: veCakeContract.chain,
    })

    setStatus(ApproveAndLockStatus.MIGRATE)

    const { hash } = await sendTransactionAsync({
      account,
      to: request.address,
      chainId: veCakeContract?.chain?.id,
      data: encodeFunctionData({
        abi: request.abi,
        functionName: request.functionName,
        args: request.args,
      } as unknown as EncodeFunctionDataParameters),
      gas: request.gas ? calculateGasMargin(request.gas) : undefined,
      gasPrice: request.gasPrice,
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
  }, [veCakeContract, account, setStatus, setTxHash, waitForTransaction, sendTransactionAsync])

  return lockCake
}
