import { useCallback } from 'react'
import { masterchefDeposit } from 'config/constants/contracts/masterchef'
import useSimulationAndSendTransaction from 'hooks/useSimulationAndSendTransaction'

const useHarvestFarm = (_farmPid: number, tokenType: string) => {
  const executeTransaction = useSimulationAndSendTransaction()

  const handleHarvest = useCallback(async () => {
    const payload = masterchefDeposit([_farmPid.toString(), '0'], [tokenType])
    return executeTransaction(payload)
  }, [_farmPid, executeTransaction, tokenType])

  return { onReward: handleHarvest }
}

export default useHarvestFarm
