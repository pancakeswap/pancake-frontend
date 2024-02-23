import { useCallback } from 'react'
import { parseUnits } from 'viem'
import { useSousChef } from 'hooks/useContract'

const options = {}

const sousUnstake = (sousChefContract: any, amount: string, decimals: number) => {
  const units = parseUnits(amount as `${number}`, decimals)

  return sousChefContract.write.withdraw([units.toString()], {
    ...options,
  })
}

const sousEmergencyUnstake = (sousChefContract: any) => {
  return sousChefContract.emergencyWithdraw({ ...options })
}

const useUnstakePool = (sousId: number, enableEmergencyWithdraw = false) => {
  const sousChefContract = useSousChef(sousId)

  const handleUnstake = useCallback(
    async (amount: string, decimals: number) => {
      if (enableEmergencyWithdraw) {
        return sousEmergencyUnstake(sousChefContract)
      }

      return sousUnstake(sousChefContract, amount, decimals)
    },
    [enableEmergencyWithdraw, sousChefContract],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstakePool
