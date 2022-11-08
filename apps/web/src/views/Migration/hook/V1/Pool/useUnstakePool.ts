import BigNumber from 'bignumber.js'
import { useCallback } from 'react'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'
import { parseUnits } from '@ethersproject/units'
import { useMasterchefV1, useSousChef } from 'hooks/useContract'
import { useGasPrice } from 'state/user/hooks'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

const sousUnstake = (sousChefContract: any, amount: string, decimals: number, gasPrice: string) => {
  const units = parseUnits(amount, decimals)

  return sousChefContract.withdraw(units.toString(), {
    ...options,
    gasPrice,
  })
}

const sousEmergencyUnstake = (sousChefContract: any, gasPrice: string) => {
  return sousChefContract.emergencyWithdraw({ ...options, gasPrice })
}

const useUnstakePool = (sousId: number, enableEmergencyWithdraw = false) => {
  const masterChefV1Contract = useMasterchefV1()
  const sousChefContract = useSousChef(sousId)
  const gasPrice = useGasPrice()

  const handleUnstake = useCallback(
    async (amount: string, decimals: number) => {
      if (sousId === 0) {
        const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
        return masterChefV1Contract.leaveStaking(value, {
          ...options,
          gasPrice,
        })
      }

      if (enableEmergencyWithdraw) {
        return sousEmergencyUnstake(sousChefContract, gasPrice)
      }

      return sousUnstake(sousChefContract, amount, decimals, gasPrice)
    },
    [enableEmergencyWithdraw, masterChefV1Contract, sousChefContract, sousId, gasPrice],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstakePool
