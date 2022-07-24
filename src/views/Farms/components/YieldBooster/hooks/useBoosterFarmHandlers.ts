import { useCallback } from 'react'

import _isEmpty from 'lodash/isEmpty'
import { useBCakeFarmBoosterContract } from 'hooks/useContract'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'

const useBoosterFarmHandlers = (farmPid: number, onDone) => {
  const farmBoosterContract = useBCakeFarmBoosterContract()
  const { fetchWithCatchTxError, loading: isConfirming } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()

  const activate = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(farmBoosterContract, 'activate', [farmPid])
    })

    if (receipt?.status && onDone) {
      onDone()
    }
  }, [farmPid, farmBoosterContract, callWithGasPrice, fetchWithCatchTxError, onDone])

  const deactivate = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(farmBoosterContract, 'deactivate', [farmPid])
    })

    if (receipt?.status && onDone) {
      onDone()
    }
  }, [farmPid, farmBoosterContract, callWithGasPrice, fetchWithCatchTxError, onDone])

  return { activate, deactivate, isConfirming }
}

export default useBoosterFarmHandlers
