import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import BN from 'bignumber.js'
import { useVeCakeContract } from 'hooks/useContract'
import { usePublicNodeWaitForTransaction } from 'hooks/usePublicNodeWaitForTransaction'
import { useSetAtom } from 'jotai'
import { useCallback } from 'react'
import { ApproveAndLockStatus, approveAndLockStatusAtom, cakeLockTxHashAtom } from 'state/vecake/atoms'
import { useLockCakeData } from 'state/vecake/hooks'
import { calculateGasMargin } from 'utils'
import { useAccount, useSendTransaction } from 'wagmi'
import { encodeFunctionData } from 'viem'
import { EncodeFunctionDataParameters } from 'viem/_types/utils/abi/encodeFunctionData'
import { useRoundedUnlockTimestamp } from '../useRoundedUnlockTimestamp'

// invoke the lock function on the vecake contract
export const useWriteLockCallback = () => {
  const veCakeContract = useVeCakeContract()
  const { address: account } = useAccount()
  const { cakeLockAmount, cakeLockWeeks } = useLockCakeData()
  const setStatus = useSetAtom(approveAndLockStatusAtom)
  const setTxHash = useSetAtom(cakeLockTxHashAtom)
  const { waitForTransaction } = usePublicNodeWaitForTransaction()
  const roundedUnlockTimestamp = useRoundedUnlockTimestamp()
  const { sendTransactionAsync } = useSendTransaction()

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
    setTxHash,
    waitForTransaction,
    sendTransactionAsync,
  ])

  return lockCake
}
