import { BOOSTED_FARM_V3_GAS_LIMIT } from 'config'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useERC20, useV2SSBCakeWrapperContract } from 'hooks/useContract'
import { useCallback } from 'react'
import { useFeeDataWithGasPrice } from 'state/user/hooks'
import { bCakeHarvestFarm, bCakeStakeFarm, bCakeUnStakeFarm } from 'utils/calls'
import { Address, maxUint256, zeroAddress } from 'viem'

export const useV2FarmActions = (lpAddress: Address, bCakeWrapperAddress?: Address) => {
  const { gasPrice } = useFeeDataWithGasPrice()
  const V2SSBCakeContract = useV2SSBCakeWrapperContract(bCakeWrapperAddress ?? zeroAddress)

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
    if (!bCakeWrapperAddress) return Promise.resolve()

    return callWithGasPrice(lpContract, 'approve', [bCakeWrapperAddress, maxUint256])
  }, [bCakeWrapperAddress, callWithGasPrice, lpContract])

  return {
    onStake,
    onUnStake,
    onHarvest,
    onApprove,
  }
}
