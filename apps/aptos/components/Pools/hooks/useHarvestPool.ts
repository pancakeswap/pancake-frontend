import { SmartChef } from 'contracts/smartchef'
import useSimulationAndSendTransaction from 'hooks/useSimulationAndSendTransaction'
import { useCallback } from 'react'

export default function useHarvestPool({ stakingTokenAddress, earningTokenAddress, sousId }) {
  const executeTransaction = useSimulationAndSendTransaction()

  return useCallback(() => {
    const payload = SmartChef.withdraw({
      amount: '0',
      uid: sousId,
      stakeTokenAddress: stakingTokenAddress,
      rewardTokenAddress: earningTokenAddress,
    })

    return executeTransaction(payload)
  }, [earningTokenAddress, executeTransaction, sousId, stakingTokenAddress])
}
