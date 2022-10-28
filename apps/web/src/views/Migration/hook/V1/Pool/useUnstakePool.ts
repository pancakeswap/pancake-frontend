import BigNumber from 'bignumber.js'
import { useCallback } from 'react'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'
import { parseUnits } from '@ethersproject/units'
import { useMasterchefV1, useSousChef } from 'hooks/useContract'

const sousUnstake = (sousChefContract: any, amount: string, decimals: number) => {
  const units = parseUnits(amount, decimals)

  return sousChefContract.withdraw(units.toString())
}

const sousEmergencyUnstake = (sousChefContract: any) => {
  return sousChefContract.emergencyWithdraw()
}

const useUnstakePool = (sousId: number, enableEmergencyWithdraw = false) => {
  const masterChefV1Contract = useMasterchefV1()
  const sousChefContract = useSousChef(sousId)

  const handleUnstake = useCallback(
    async (amount: string, decimals: number) => {
      if (sousId === 0) {
        const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
        return masterChefV1Contract.leaveStaking(value, { gasLimit: DEFAULT_GAS_LIMIT })
      }

      if (enableEmergencyWithdraw) {
        return sousEmergencyUnstake(sousChefContract)
      }

      return sousUnstake(sousChefContract, amount, decimals)
    },
    [enableEmergencyWithdraw, masterChefV1Contract, sousChefContract, sousId],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstakePool
