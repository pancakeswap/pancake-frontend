import { useCallback } from 'react'
import { Contract } from 'web3-eth-contract'
import { ethers } from 'ethers'
import { useWallet } from 'use-wallet'

export const useApprove = (tokenContract: Contract, spenderAddress: string) => {
  const { account } = useWallet()
  const onApprove = useCallback(async () => {
    try {
      const tx = await tokenContract.methods
        .approve(spenderAddress, ethers.constants.MaxUint256)
        .send({ from: account })
      return tx
    } catch {
      return false
    }
  }, [account, spenderAddress, tokenContract])

  return onApprove
}

export default useApprove
