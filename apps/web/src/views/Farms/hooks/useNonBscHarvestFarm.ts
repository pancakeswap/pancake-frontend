import { useCallback } from 'react'
import { Address } from 'viem'
import { useCrossFarmingProxy } from 'hooks/useContract'

const useNonBscHarvestFarm = (farmPid: number, cProxyAddress: Address) => {
  const contract = useCrossFarmingProxy(cProxyAddress)

  const handleHarvest = useCallback(async () => {
    return contract.write.harvest([farmPid])
  }, [contract, farmPid])

  return { onReward: handleHarvest }
}

export default useNonBscHarvestFarm
