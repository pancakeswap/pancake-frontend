import { useCallback } from 'react'
import { ethers } from 'ethers'
import { Ifo } from 'config/constants/types'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useERC20 } from 'hooks/useContract'
import { TransactionResponse, TransactionReceipt } from '@ethersproject/providers'

const useIfoApprove = (ifo: Ifo, spenderAddress: string) => {
  const raisingTokenContract = useERC20(ifo.currency.address)
  const { callWithGasPrice } = useCallWithGasPrice()
  const onApprove = useCallback(
    async (
      onTransactionSubmitted: (tx: TransactionResponse) => void,
      onSuccess: (receipt: TransactionReceipt) => void,
      onError: (receipt: TransactionReceipt) => void,
    ) => {
      const tx = await callWithGasPrice(raisingTokenContract, 'approve', [spenderAddress, ethers.constants.MaxUint256])
      onTransactionSubmitted(tx)
      const receipt = await tx.wait()
      if (receipt.status) {
        onSuccess(receipt)
      } else {
        onError(receipt)
      }
    },
    [spenderAddress, raisingTokenContract, callWithGasPrice],
  )

  return onApprove
}

export default useIfoApprove
