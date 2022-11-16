import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { masterchefDeposit } from 'config/constants/contracts/masterchef'
import { FARMS_DEFAULT_TOKEN_DECIMAL } from 'config'
import useSimulationAndSendTransaction from 'hooks/useSimulationAndSendTransaction'

const useStakeFarms = (tokenType: string) => {
  const executeTransaction = useSimulationAndSendTransaction()

  const handleStake = useCallback(
    async (_amount: string) => {
      const value = new BigNumber(_amount).times(FARMS_DEFAULT_TOKEN_DECIMAL).toString()
      const payload = masterchefDeposit([value], [tokenType])
      return executeTransaction(payload)
    },
    [tokenType, executeTransaction],
  )

  return { onStake: handleStake }
}

export default useStakeFarms
