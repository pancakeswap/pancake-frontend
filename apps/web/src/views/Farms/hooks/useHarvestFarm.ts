import { useMasterchef, useV2SSBCakeWrapperContract } from 'hooks/useContract'
import { useCallback } from 'react'
import { useGasPrice } from 'state/user/hooks'
import { bCakeHarvestFarm, harvestFarm } from 'utils/calls'
import { Address } from 'viem'

const useHarvestFarm = (farmPid: number) => {
  const masterChefContract = useMasterchef()
  const gasPrice = useGasPrice()

  const handleHarvest = useCallback(async () => {
    return harvestFarm(masterChefContract, farmPid, gasPrice)
  }, [farmPid, masterChefContract, gasPrice])

  return { onReward: handleHarvest }
}

export const useBCakeHarvestFarm = (bCakeWrapperAddress: Address) => {
  const V2SSBCakeContract = useV2SSBCakeWrapperContract(bCakeWrapperAddress)
  const gasPrice = useGasPrice()

  const handleHarvest = useCallback(async () => {
    return bCakeHarvestFarm(V2SSBCakeContract, gasPrice)
  }, [V2SSBCakeContract, gasPrice])

  return { onReward: handleHarvest }
}

export default useHarvestFarm
