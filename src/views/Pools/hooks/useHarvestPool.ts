import { useCallback } from 'react'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { useSousChef } from 'hooks/useContract'
import { BOOSTED_FARM_GAS_LIMIT } from 'config'

const options = {
  gasLimit: BOOSTED_FARM_GAS_LIMIT,
}

const harvestPool = async (sousChefContract) => {
  return sousChefContract.deposit('0', options)
}

const harvestPoolBnb = async (sousChefContract) => {
  return sousChefContract.deposit({ ...options, value: BIG_ZERO })
}

const useHarvestPool = (sousId, isUsingBnb = false) => {
  const sousChefContract = useSousChef(sousId)

  const handleHarvest = useCallback(async () => {
    if (isUsingBnb) {
      return harvestPoolBnb(sousChefContract)
    }

    return harvestPool(sousChefContract)
  }, [isUsingBnb, sousChefContract])

  return { onReward: handleHarvest }
}

export default useHarvestPool
