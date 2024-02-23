import { useCallback } from 'react'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { useSousChef } from 'hooks/useContract'

const options = {}

const harvestPool = async (sousChefContract) => {
  return sousChefContract.write.deposit(['0'], { ...options })
}

const harvestPoolBnb = async (sousChefContract) => {
  return sousChefContract.write.deposit({
    ...options,
    value: BIG_ZERO.toString(),
  })
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
