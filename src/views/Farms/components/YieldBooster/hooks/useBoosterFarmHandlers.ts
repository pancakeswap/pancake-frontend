import { useCallback } from 'react'

import _isEmpty from 'lodash/isEmpty'
import { useBCakeFarmBoosterContract } from 'hooks/useContract'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'

const useBoosterFarmHandlers = (farmPid: number) => {
  const farmBoosterContract = useBCakeFarmBoosterContract()
  const { fetchWithCatchTxError, loading: isConfirming } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()

  const activate = useCallback(() => {
    fetchWithCatchTxError(() => {
      return callWithGasPrice(farmBoosterContract, 'activate', [farmPid])
    })
  }, [farmPid, farmBoosterContract, callWithGasPrice, fetchWithCatchTxError])

  const deactivate = useCallback(() => {
    fetchWithCatchTxError(() => {
      return callWithGasPrice(farmBoosterContract, 'deactivate', [farmPid])
    })
  }, [farmPid, farmBoosterContract, callWithGasPrice, fetchWithCatchTxError])

  return { activate, deactivate, isConfirming }
}

export default useBoosterFarmHandlers
