import { useCallback } from 'react'
import { useSendTransaction } from '@pancakeswap/awgmi'
import { masterchefDeposit } from 'config/constants/contracts/masterchef'

const useHarvestFarm = (_farmPid: number, tokenType: string) => {
  const { sendTransactionAsync } = useSendTransaction()

  const handleHarvest = useCallback(async () => {
    const payload = masterchefDeposit([_farmPid.toString(), '0'], [tokenType])
    return sendTransactionAsync({ payload })
  }, [_farmPid, sendTransactionAsync, tokenType])

  return { onReward: handleHarvest }
}

export default useHarvestFarm
