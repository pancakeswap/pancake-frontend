import { useCallback } from 'react'
import { parseUnits } from '@ethersproject/units'
import { unstakeFarm } from 'utils/calls'
import { useMasterchef, useSousChef } from 'hooks/useContract'
import getGasPrice from 'utils/getGasPrice'

const sousUnstake = (sousChefContract: any, amount: string, decimals: number) => {
  const gasPrice = getGasPrice()
  const units = parseUnits(amount, decimals)

  return sousChefContract.withdraw(units.toString(), {
    gasPrice,
  })
}

const sousEmergencyUnstake = (sousChefContract: any) => {
  const gasPrice = getGasPrice()
  return sousChefContract.emergencyWithdraw({ gasPrice })
}

const useUnstakePool = (sousId: number, enableEmergencyWithdraw = false) => {
  const masterChefContract = useMasterchef()
  const sousChefContract = useSousChef(sousId)

  const handleUnstake = useCallback(
    async (amount: string, decimals: number) => {
      if (sousId === 0) {
        return unstakeFarm(masterChefContract, 0, amount)
      }
      if (enableEmergencyWithdraw) {
        return sousEmergencyUnstake(sousChefContract)
      }

      return sousUnstake(sousChefContract, amount, decimals)
    },
    [enableEmergencyWithdraw, masterChefContract, sousChefContract, sousId],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstakePool
