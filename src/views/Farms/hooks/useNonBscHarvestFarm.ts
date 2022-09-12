import { useCallback } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { nonBscHarvestFarm } from 'utils/calls'
import { useNonBscVault } from 'hooks/useContract'
import { useGasPrice } from 'state/user/hooks'
import { useOraclePrice } from 'views/Farms/hooks/useFetchOraclePrice'

const useNonBscHarvestFarm = (farmPid: number) => {
  const { account, chainId } = useActiveWeb3React()
  const oraclePrice = useOraclePrice(chainId)
  const nonBscVaultContract = useNonBscVault()
  const gasPrice = useGasPrice()

  const handleHarvest = useCallback(async () => {
    return nonBscHarvestFarm(nonBscVaultContract, farmPid, gasPrice, account, oraclePrice, chainId)
  }, [farmPid, nonBscVaultContract, gasPrice, account, oraclePrice, chainId])

  return { onReward: handleHarvest }
}

export default useNonBscHarvestFarm
