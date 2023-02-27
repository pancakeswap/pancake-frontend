import { SmartChef } from 'contracts/smartchef'
import { getFullDecimalMultiplier } from '@pancakeswap/utils/getFullDecimalMultiplier'
import BigNumber from 'bignumber.js'
import useSimulationAndSendTransaction from 'hooks/useSimulationAndSendTransaction'
import { useCallback } from 'react'

export default function useStakePool({ stakingTokenAddress, earningTokenAddress, uid, stakingTokenDecimals }) {
  const executeTransaction = useSimulationAndSendTransaction()

  const onUnstake = useCallback(
    (amount) => {
      const stakeAmount = new BigNumber(amount).times(getFullDecimalMultiplier(stakingTokenDecimals)).toString()

      const payload = SmartChef.withdraw({
        amount: stakeAmount,
        uid,
        stakeTokenAddress: stakingTokenAddress,
        rewardTokenAddress: earningTokenAddress,
      })

      return executeTransaction(payload)
    },
    [earningTokenAddress, executeTransaction, stakingTokenAddress, stakingTokenDecimals, uid],
  )

  return onUnstake
}
