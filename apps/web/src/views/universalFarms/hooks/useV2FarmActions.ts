import { Protocol } from '@pancakeswap/farms'
import { BOOSTED_FARM_V3_GAS_LIMIT } from 'config'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useERC20, useV2SSBCakeWrapperContract } from 'hooks/useContract'
import { useCallback } from 'react'
import { useFeeDataWithGasPrice } from 'state/user/hooks'
import { bCakeHarvestFarm, bCakeStakeFarm, bCakeUnStakeFarm } from 'utils/calls'
import { Address, maxUint256 } from 'viem'
import { useBCakeWrapperAddress } from './useBCakeWrapperAddress'

export const useV2FarmActions = (lpAddress: Address, chainId: number, protocol?: Protocol) => {
  const bCakeWrapperAddress = useBCakeWrapperAddress({ lpAddress, chainId, protocol })
  const { gasPrice } = useFeeDataWithGasPrice()
  const V2SSBCakeContract = useV2SSBCakeWrapperContract(bCakeWrapperAddress)

  const onStake = useCallback(
    async (amount: string) => bCakeStakeFarm(V2SSBCakeContract, amount, gasPrice, BOOSTED_FARM_V3_GAS_LIMIT),
    [V2SSBCakeContract, gasPrice],
  )

  const onUnStake = useCallback(
    async (amount: string) => bCakeUnStakeFarm(V2SSBCakeContract, amount, gasPrice, BOOSTED_FARM_V3_GAS_LIMIT),
    [V2SSBCakeContract, gasPrice],
  )

  const onHarvest = useCallback(async () => {
    return bCakeHarvestFarm(V2SSBCakeContract, gasPrice)
  }, [V2SSBCakeContract, gasPrice])

  const { callWithGasPrice } = useCallWithGasPrice()
  const lpContract = useERC20(lpAddress)
  const onApprove = useCallback(async () => {
    return callWithGasPrice(lpContract, 'approve', [bCakeWrapperAddress, maxUint256])
  }, [bCakeWrapperAddress, callWithGasPrice, lpContract])

  return {
    onStake,
    onUnStake,
    onHarvest,
    onApprove,
  }
}
