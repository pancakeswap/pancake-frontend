import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { masterchefDeposit } from 'config/constants/contracts/masterchef'
import { FARMS_DEFAULT_TOKEN_DECIMAL } from 'config'
import useSimulationAndSendTransaction from 'hooks/useSimulationAndSendTransaction'

const useStakeFarms = (_pid: number, tokenType: string) => {
  const executeTransaction = useSimulationAndSendTransaction()

  const handleStake = useCallback(
    async (_amount: string) => {
      const value = new BigNumber(_amount).times(FARMS_DEFAULT_TOKEN_DECIMAL).toString()
      const payload = masterchefDeposit([_pid.toString(), value], [tokenType])
      return executeTransaction(payload)
    },
    [_pid, tokenType, executeTransaction],
  )

  return { onStake: handleStake }
}

export default useStakeFarms
