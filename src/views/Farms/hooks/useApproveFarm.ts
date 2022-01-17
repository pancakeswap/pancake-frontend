import { useCallback } from 'react'
import { MaxUint256 } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
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
      const tx = await callWithGasPrice(lpContract, 'approve', [masterChefContract.address, MaxUint256])
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
