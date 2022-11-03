import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { useSendTransaction } from '@pancakeswap/awgmi'
import { masterchefWithdraw } from 'config/constants/contracts/masterchef'
import { FARMS_DEFAULT_TOKEN_DECIMAL } from 'config'

const useUnstakeFarms = (_pid: number, tokenType: string) => {
  const { sendTransactionAsync } = useSendTransaction()

  const handleUnstake = useCallback(
    async (_amount: string) => {
      const value = new BigNumber(_amount).times(FARMS_DEFAULT_TOKEN_DECIMAL).toString()
      const payload = masterchefWithdraw([_pid.toString(), value], [tokenType])
      return sendTransactionAsync({ payload })
    },
    [_pid, tokenType, sendTransactionAsync],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstakeFarms
