import { BOOSTED_FARM_V3_GAS_LIMIT } from 'config'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useMasterchef, useNonBscVault, useV2SSBCakeWrapperContract } from 'hooks/useContract'
import { useCallback } from 'react'
import { useFeeDataWithGasPrice } from 'state/user/hooks'
import { bCakeUnStakeFarm, nonBscUnstakeFarm, unstakeFarm } from 'utils/calls'
import { useOraclePrice } from 'views/Farms/hooks/useFetchOraclePrice'

const useUnstakeFarms = (pid?: number, vaultPid?: number) => {
  const { account, chainId } = useAccountActiveChain()
  const { gasPrice } = useFeeDataWithGasPrice()
  const oraclePrice = useOraclePrice(chainId ?? 0)
  const masterChefContract = useMasterchef()
  const nonBscVaultContract = useNonBscVault()

  const handleUnstake = useCallback(
    async (amount: string) => {
      return unstakeFarm(masterChefContract, pid, amount, gasPrice)
    },
    [masterChefContract, pid, gasPrice],
  )

  const handleUnstakeNonBsc = useCallback(
    async (amount: string) => {
      return nonBscUnstakeFarm(nonBscVaultContract, vaultPid, amount, gasPrice, account, oraclePrice, chainId)
    },
    [nonBscVaultContract, vaultPid, gasPrice, account, oraclePrice, chainId],
  )

  return { onUnstake: vaultPid ? handleUnstakeNonBsc : handleUnstake }
}

export const useBCakeUnstakeFarms = (bCakeWrapperAddress) => {
  const { gasPrice } = useFeeDataWithGasPrice()
  const V2SSBCakeContract = useV2SSBCakeWrapperContract(bCakeWrapperAddress)

  const handleUnstake = useCallback(
    async (amount: string) => {
      return bCakeUnStakeFarm(V2SSBCakeContract, amount, gasPrice, BOOSTED_FARM_V3_GAS_LIMIT)
    },
    [V2SSBCakeContract, gasPrice],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstakeFarms
