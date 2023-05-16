import { useMasterchef, useNonBscVault } from 'hooks/useContract'
import { useCallback } from 'react'
import { useFeeDataWithGasPrice } from 'state/user/hooks'
import { nonBscStakeFarm, stakeFarm } from 'utils/calls'
import { useOraclePrice } from 'views/Farms/hooks/useFetchOraclePrice'
import useAccountActiveChain from 'hooks/useAccountActiveChain'

const useStakeFarms = (pid: number, vaultPid?: number) => {
  const { account, chainId } = useAccountActiveChain()
  const { gasPrice } = useFeeDataWithGasPrice()

  const oraclePrice = useOraclePrice(chainId)
  const masterChefContract = useMasterchef()
  const nonBscVaultContract = useNonBscVault()

  const handleStake = useCallback(
    async (amount: string) => {
      return stakeFarm(masterChefContract, pid, amount, gasPrice)
    },
    [masterChefContract, pid, gasPrice],
  )

  const handleStakeNonBsc = useCallback(
    async (amount: string) => {
      return nonBscStakeFarm(nonBscVaultContract, vaultPid, amount, gasPrice, account, oraclePrice, chainId)
    },
    [nonBscVaultContract, vaultPid, gasPrice, account, oraclePrice, chainId],
  )

  return { onStake: vaultPid ? handleStakeNonBsc : handleStake }
}

export default useStakeFarms
