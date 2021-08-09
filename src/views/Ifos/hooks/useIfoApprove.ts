import { useCallback } from 'react'
import { ethers, Contract } from 'ethers'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'

const useIfoApprove = (tokenContract: Contract, spenderAddress: string) => {
  const { callWithGasPrice } = useCallWithGasPrice()
  const onApprove = useCallback(async () => {
    const tx = await callWithGasPrice(tokenContract, 'approve', [spenderAddress, ethers.constants.MaxUint256])
    await tx.wait()
  }, [spenderAddress, tokenContract, callWithGasPrice])

  return onApprove
}

export default useIfoApprove
