import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL, DEFAULT_GAS_LIMIT } from 'config'
import { useCallback } from 'react'
import { useMasterchefV1 } from 'hooks/useContract'
import { useGasPrice } from 'state/user/hooks'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

const useUnstakeFarms = (pid: number) => {
  const masterChefContract = useMasterchefV1()
  const gasPrice = useGasPrice()

  const handleUnstake = useCallback(
    async (amount: string) => {
      const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
      if (pid === 0) {
        return masterChefContract.leaveStaking(value, {
          ...options,
          gasPrice,
        })
      }

      return masterChefContract.withdraw(pid, value, {
        ...options,
        gasPrice,
      })
    },
    [masterChefContract, pid, gasPrice],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstakeFarms
