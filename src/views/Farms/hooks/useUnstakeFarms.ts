import { useCallback } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { unstakeFarm, nonBscUnstakeFarm } from 'utils/calls'
import { useMasterchef, useNonBscVault } from 'hooks/useContract'
import { useGasPrice } from 'state/user/hooks'
import { verifyBscNetwork } from 'utils/verifyBscNetwork'
import { useOraclePrice } from 'views/Farms/hooks/useFetchOraclePrice'

const useUnstakeFarms = (pid: number) => {
  const { account, chainId } = useActiveWeb3React()
  const gasPrice = useGasPrice()
  const oraclePrice = useOraclePrice(chainId)
  const isBscNetwork = verifyBscNetwork(chainId)
  const masterChefContract = useMasterchef()
  const nonBscVaultContract = useNonBscVault()

  const handleUnstake = useCallback(
    async (amount: string) => {
      if (isBscNetwork) {
        return unstakeFarm(masterChefContract, pid, amount, gasPrice)
      }

      return nonBscUnstakeFarm(nonBscVaultContract, pid, amount, gasPrice, account, oraclePrice, chainId)
    },
    [masterChefContract, nonBscVaultContract, pid, gasPrice, isBscNetwork, account, oraclePrice, chainId],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstakeFarms
