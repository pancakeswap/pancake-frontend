import { useVeCakeContract } from 'hooks/useContract'
import { useCallback } from 'react'
import BN from 'bignumber.js'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { useAccount, useWalletClient } from 'wagmi'
import { useLockCakeData } from 'state/vecake/hooks'
import { useSetAtom } from 'jotai'
import { approveAndLockStatusAtom, cakeLockTxHashAtom, ApproveAndLockStatus } from 'state/vecake/atoms'
import { usePublicNodeWaitForTransaction } from 'hooks/usePublicNodeWaitForTransaction'

export const useWriteIncreaseLockAmountCallback = () => {
  const veCakeContract = useVeCakeContract()
  const { address: account } = useAccount()
  const { cakeLockAmount } = useLockCakeData()
  const setTxHash = useSetAtom(cakeLockTxHashAtom)
  const setStatus = useSetAtom(approveAndLockStatusAtom)
  const { data: walletClient } = useWalletClient()
  const { waitForTransaction } = usePublicNodeWaitForTransaction()

  const increaseLockAmount = useCallback(async () => {
    const { request } = await veCakeContract.simulate.increaseLockAmount(
      [BigInt(getDecimalAmount(new BN(cakeLockAmount), 18).toString())],
      {
        account: account!,
        chain: veCakeContract.chain,
      },
    )

    setStatus(ApproveAndLockStatus.INCREASE_AMOUNT)

    const hash = await walletClient?.writeContract({
      ...request,
      account,
    })
    setTxHash(hash ?? '')
    setStatus(ApproveAndLockStatus.INCREASE_AMOUNT_PENDING)
    if (hash) {
      await waitForTransaction({ hash })
    }
    setStatus(ApproveAndLockStatus.CONFIRMED)
  }, [veCakeContract, cakeLockAmount, account, setStatus, setTxHash, waitForTransaction, walletClient])

  return increaseLockAmount
}
