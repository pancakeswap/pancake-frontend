import { useCallback } from 'react'
import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { Contract } from 'ethers'
import { getMasterChefV2Address, getNonBscVaultAddress } from 'utils/addressHelpers'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { verifyBscNetwork } from 'utils/verifyBscNetwork'

const useApproveFarm = (lpContract: Contract, chainId: number) => {
  const isBscNetwork = verifyBscNetwork(chainId)
  const contractAddress = isBscNetwork ? getMasterChefV2Address(chainId) : getNonBscVaultAddress(chainId)

  const { callWithGasPrice } = useCallWithGasPrice()
  const handleApprove = useCallback(async () => {
    return callWithGasPrice(lpContract, 'approve', [contractAddress, MaxUint256])
  }, [lpContract, contractAddress, callWithGasPrice])

  return { onApprove: handleApprove }
}

export default useApproveFarm

export const useApproveBoostProxyFarm = (lpContract: Contract, proxyAddress?: string) => {
  const { callWithGasPrice } = useCallWithGasPrice()
  const handleApprove = useCallback(async () => {
    return proxyAddress && callWithGasPrice(lpContract, 'approve', [proxyAddress, MaxUint256])
  }, [lpContract, proxyAddress, callWithGasPrice])

  return { onApprove: handleApprove }
}
