import { useCrossFarmingProxy } from 'hooks/useContract'
import { useCallback } from 'react'
import { Address } from 'viem'

const useCrossChainHarvestFarm = (farmPid: number, cProxyAddress?: Address) => {
  const contract = useCrossFarmingProxy(cProxyAddress)

  const handleHarvest = useCallback(async () => {
    if (contract && contract.account) {
      return contract.write.harvest([BigInt(farmPid)], {
        account: contract.account,
        chain: contract.chain,
      })
    }
    return undefined
  }, [contract, farmPid])

  return { onReward: handleHarvest }
}

export default useCrossChainHarvestFarm
