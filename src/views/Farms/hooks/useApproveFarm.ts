import { useCallback } from 'react'
import { ethers, Contract } from 'ethers'
import { useMasterchef } from 'hooks/useContract'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { TransactionResponse, TransactionReceipt } from '@ethersproject/providers'

const useApproveFarm = (lpContract: Contract) => {
  const masterChefContract = useMasterchef()
  const { callWithGasPrice } = useCallWithGasPrice()
  const handleApprove = useCallback(
    async (
      onTransactionSubmitted: (tx: TransactionResponse) => void,
      onSuccess: (receipt: TransactionReceipt) => void,
      onError: (receipt: TransactionReceipt) => void,
    ) => {
      const tx = await callWithGasPrice(lpContract, 'approve', [
        masterChefContract.address,
        ethers.constants.MaxUint256,
      ])
      onTransactionSubmitted(tx)
      const receipt = await tx.wait()
      if (receipt.status) {
        onSuccess(receipt)
      } else {
        onError(receipt)
      }
    },
    [lpContract, masterChefContract, callWithGasPrice],
  )

  return { onApprove: handleApprove }
}

export default useApproveFarm
