import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { useSendTransaction } from '@pancakeswap/awgmi'
import { masterchefDeposit } from 'config/constants/contracts/masterchef'
import { FARMS_DEFAULT_TOKEN_DECIMAL } from 'config'

const useStakeFarms = (_pid: number, tokenType: string) => {
  const { sendTransactionAsync } = useSendTransaction()

  const handleStake = useCallback(
    async (_amount: string) => {
      const value = new BigNumber(_amount).times(FARMS_DEFAULT_TOKEN_DECIMAL).toString()
      const payload = masterchefDeposit([_pid.toString(), value], [tokenType])
      return sendTransactionAsync({ payload })
    },
    [_pid, tokenType, sendTransactionAsync],
  )

  return { onStake: handleStake }
}

export default useStakeFarms
