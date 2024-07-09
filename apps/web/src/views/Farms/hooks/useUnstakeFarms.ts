import { BOOSTED_FARM_V3_GAS_LIMIT } from 'config'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useMasterchef, useCrossFarmingVault, useV2SSBCakeWrapperContract } from 'hooks/useContract'
import { useCallback } from 'react'
import { useFeeDataWithGasPrice } from 'state/user/hooks'
import { bCakeUnStakeFarm, crossChainUnstakeFarm, unstakeFarm } from 'utils/calls'
import { useOraclePrice } from 'views/Farms/hooks/useFetchOraclePrice'
import { ChainId } from '@pancakeswap/chains'

const useUnstakeFarms = (pid?: number, vaultPid?: number) => {
  const { account, chainId } = useAccountActiveChain()
  const { gasPrice } = useFeeDataWithGasPrice()
  const { gasPrice: bnbGasPrice } = useFeeDataWithGasPrice(ChainId.BSC)
  const oraclePrice = useOraclePrice(chainId ?? 0)
  const masterChefContract = useMasterchef()
  const crossFarmingVaultContract = useCrossFarmingVault()

  const handleUnstake = useCallback(
    async (amount: string) => {
      return unstakeFarm(masterChefContract, pid, amount, gasPrice)
    },
    [masterChefContract, pid, gasPrice],
  )

  const handleUnstakeCrossChain = useCallback(
    async (amount: string) => {
      return crossChainUnstakeFarm(
        crossFarmingVaultContract,
        vaultPid,
        amount,
        bnbGasPrice,
        account,
        oraclePrice,
        chainId,
      )
    },
    [crossFarmingVaultContract, vaultPid, bnbGasPrice, account, oraclePrice, chainId],
  )

  return { onUnstake: vaultPid ? handleUnstakeCrossChain : handleUnstake }
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
