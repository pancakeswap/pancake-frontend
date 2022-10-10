import BigNumber from 'bignumber.js'
import { BOOSTED_FARM_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'
import { useCallback } from 'react'
import { useMasterchefV1 } from 'hooks/useContract'

const options = {
  gasLimit: BOOSTED_FARM_GAS_LIMIT,
}

const useUnstakeFarms = (pid: number) => {
  const masterChefContract = useMasterchefV1()

  const handleUnstake = useCallback(
    async (amount: string) => {
      const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
      if (pid === 0) {
        return masterChefContract.leaveStaking(value, options)
      }

      return masterChefContract.withdraw(pid, value, options)
    },
    [masterChefContract, pid],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstakeFarms
