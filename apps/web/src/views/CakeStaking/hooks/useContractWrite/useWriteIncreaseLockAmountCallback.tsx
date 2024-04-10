import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import BN from 'bignumber.js'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useVeCakeContract } from 'hooks/useContract'
import { usePublicNodeWaitForTransaction } from 'hooks/usePublicNodeWaitForTransaction'
import { useSetAtom } from 'jotai'
import { useCallback } from 'react'
import { ApproveAndLockStatus, approveAndLockStatusAtom, cakeLockTxHashAtom } from 'state/vecake/atoms'
import { useLockCakeData } from 'state/vecake/hooks'
import { logger } from 'utils/datadog'
import { logTx } from 'utils/log'
import { isUserRejected } from 'utils/sentry'
import { encodeFunctionData, TransactionExecutionError } from 'viem'
import { useAccount, useSendTransaction } from 'wagmi'
import { EncodeFunctionDataParameters } from 'viem/_types/utils/abi/encodeFunctionData'

export const useWriteIncreaseLockAmountCallback = () => {
  const { chainId } = useActiveChainId()
  const veCakeContract = useVeCakeContract()
  const { address: account } = useAccount()
  const { cakeLockAmount } = useLockCakeData()
  const setTxHash = useSetAtom(cakeLockTxHashAtom)
  const setStatus = useSetAtom(approveAndLockStatusAtom)
  const { sendTransactionAsync } = useSendTransaction()
  const { waitForTransaction } = usePublicNodeWaitForTransaction()

  const increaseLockAmount = useCallback(async () => {
    if (!account || !cakeLockAmount) return

    const { request } = await veCakeContract.simulate.increaseLockAmount(
      [BigInt(getDecimalAmount(new BN(cakeLockAmount), 18).toString())],
      {
        account: account!,
        chain: veCakeContract.chain,
      },
    )

    setStatus(ApproveAndLockStatus.INCREASE_AMOUNT)

    try {
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
      setStatus(ApproveAndLockStatus.INCREASE_AMOUNT_PENDING)
      if (hash) {
        const transactionReceipt = await waitForTransaction({ hash })
        logTx({ account, chainId: chainId!, hash })
        if (transactionReceipt?.status === 'success') {
          setStatus(ApproveAndLockStatus.CONFIRMED)
        } else {
          setStatus(ApproveAndLockStatus.ERROR)
        }
      }
    } catch (error: any) {
      if (!isUserRejected(error)) {
        logger.warn(
          '[CakeStaking]: Failed to increase lock amount',
          {
            error: error instanceof TransactionExecutionError ? error.cause : error,
            account,
            chainId,
          },
          error,
        )
      }
      throw error
    }
  }, [
    account,
    cakeLockAmount,
    veCakeContract.simulate,
    veCakeContract.chain,
    setStatus,
    setTxHash,
    waitForTransaction,
    chainId,
    sendTransactionAsync,
  ])

  return increaseLockAmount
}
