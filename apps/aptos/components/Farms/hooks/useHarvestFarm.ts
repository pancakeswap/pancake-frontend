import { useCallback } from 'react'
import { masterchefDeposit } from 'config/constants/contracts/masterchef'
import useSimulationAndSendTransaction from 'hooks/useSimulationAndSendTransaction'

const useHarvestFarm = (tokenType: string) => {
  const executeTransaction = useSimulationAndSendTransaction()

  const handleHarvest = useCallback(async () => {
    const payload = masterchefDeposit(['0'], [tokenType])
    return executeTransaction(payload)
  }, [executeTransaction, tokenType])

  return { onReward: handleHarvest }
}

export default useHarvestFarm
