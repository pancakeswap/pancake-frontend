import { useCallback } from 'react'
import { ethers, Contract } from 'ethers'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'

const useIfoApprove = (tokenContract: Contract, spenderAddress: string) => {
  const { callWithGasPrice } = useCallWithGasPrice()
  const onApprove = useCallback(async (): Promise<ethers.providers.TransactionReceipt> => {
    const tx = await callWithGasPrice(tokenContract, 'approve', [spenderAddress, ethers.constants.MaxUint256])
    return tx.wait()
  }, [spenderAddress, tokenContract, callWithGasPrice])

  return onApprove
}

export default useIfoApprove
