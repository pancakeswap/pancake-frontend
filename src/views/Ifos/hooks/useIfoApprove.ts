import { useCallback } from 'react'
import { ethers, Contract } from 'ethers'

const useIfoApprove = (tokenContract: Contract, spenderAddress: string) => {
  const onApprove = useCallback(async () => {
    const tx = await tokenContract.approve(spenderAddress, ethers.constants.MaxUint256)
    await tx.wait()
  }, [spenderAddress, tokenContract])

  return onApprove
}

export default useIfoApprove
