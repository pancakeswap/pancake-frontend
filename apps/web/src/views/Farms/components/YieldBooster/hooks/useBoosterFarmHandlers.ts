import { useCallback } from 'react'

import _isEmpty from 'lodash/isEmpty'
import { useBCakeFarmBoosterContract } from 'hooks/useContract'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallWithMarketGasPrice } from 'hooks/useCallWithMarketGasPrice'

const useBoosterFarmHandlers = (farmPid: number, onDone) => {
  const farmBoosterContract = useBCakeFarmBoosterContract()
  const { fetchWithCatchTxError, loading: isConfirming } = useCatchTxError()
  const { callWithMarketGasPrice } = useCallWithMarketGasPrice()

  const activate = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithMarketGasPrice(farmBoosterContract, 'activate', [farmPid])
    })

    if (receipt?.status && onDone) {
      onDone()
    }
  }, [farmPid, farmBoosterContract, callWithMarketGasPrice, fetchWithCatchTxError, onDone])

  const deactivate = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithMarketGasPrice(farmBoosterContract, 'deactive', [farmPid])
    })

    if (receipt?.status && onDone) {
      onDone()
    }
  }, [farmPid, farmBoosterContract, callWithMarketGasPrice, fetchWithCatchTxError, onDone])

  return { activate, deactivate, isConfirming }
}

export default useBoosterFarmHandlers
