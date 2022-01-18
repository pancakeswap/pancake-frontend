import { useCallback } from 'react'
import { ethers, Contract } from 'ethers'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { TransactionResponse, TransactionReceipt } from '@ethersproject/providers'

const useIfoApprove = (tokenContract: Contract, spenderAddress: string) => {
  const { callWithGasPrice } = useCallWithGasPrice()
  const onApprove = useCallback(
    async (
      onTransactionSubmitted: (tx: TransactionResponse) => void,
      onSuccess: (receipt: TransactionReceipt) => void,
      onError: (receipt: TransactionReceipt) => void,
    ) => {
      const tx = await callWithGasPrice(tokenContract, 'approve', [spenderAddress, ethers.constants.MaxUint256])
      onTransactionSubmitted(tx)
      const receipt = await tx.wait()
      if (receipt.status) {
        onSuccess(receipt)
      } else {
        onError(receipt)
      }
    },
    [spenderAddress, tokenContract, callWithGasPrice],
  )

  return onApprove
}

export default useIfoApprove
