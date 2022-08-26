import { useCallback } from 'react'
import { stakeFarm } from 'utils/calls'
import { useMasterchef } from 'hooks/useContract'
import { useGasPrice } from 'state/user/hooks'

const useStakeFarms = (pid: number) => {
  const masterChefContract = useMasterchef()
  const gasPrice = useGasPrice()

  const handleStake = useCallback(
    async (amount: string) => {
      return stakeFarm(masterChefContract, pid, amount, gasPrice)
    },
    [masterChefContract, pid, gasPrice],
  )

  return { onStake: handleStake }
}

export default useStakeFarms
