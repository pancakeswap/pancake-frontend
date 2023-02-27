import { useCallback } from 'react'
import { useCrossFarmingProxy } from 'hooks/useContract'

const useNonBscHarvestFarm = (farmPid: number, cProxyAddress: string) => {
  const contract = useCrossFarmingProxy(cProxyAddress)

  const handleHarvest = useCallback(async () => {
    return contract.harvest(farmPid)
  }, [contract, farmPid])

  return { onReward: handleHarvest }
}

export default useNonBscHarvestFarm
