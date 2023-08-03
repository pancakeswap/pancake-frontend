import { useCallback } from 'react'
import { DEFAULT_GAS_LIMIT } from 'config'
import { parseUnits } from 'viem'
import { useSousChef } from 'hooks/useContract'
import { useGasPrice } from 'state/user/hooks'

const options = {
  gas: DEFAULT_GAS_LIMIT,
}

const sousUnstake = (sousChefContract: any, amount: string, decimals: number, gasPrice: bigint) => {
  const units = parseUnits(amount as `${number}`, decimals)

  return sousChefContract.write.withdraw([units.toString()], {
    ...options,
    gasPrice,
  })
}

const sousEmergencyUnstake = (sousChefContract: any, gasPrice: bigint) => {
  return sousChefContract.emergencyWithdraw({ ...options, gasPrice })
}

const useUnstakePool = (sousId: number, enableEmergencyWithdraw = false) => {
  const sousChefContract = useSousChef(sousId)
  const gasPrice = useGasPrice()

  const handleUnstake = useCallback(
    async (amount: string, decimals: number) => {
      if (enableEmergencyWithdraw) {
        return sousEmergencyUnstake(sousChefContract, gasPrice)
      }

      return sousUnstake(sousChefContract, amount, decimals, gasPrice)
    },
    [enableEmergencyWithdraw, sousChefContract, gasPrice],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstakePool
