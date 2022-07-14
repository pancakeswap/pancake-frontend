import { useCallback } from 'react'

import _isEmpty from 'lodash/isEmpty'
import { useFarmBooster } from 'hooks/useContract'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'

const useBoosterFarmHandlers = (farmPid: number) => {
  const farmBoosterContract = useFarmBooster()
  const { fetchWithCatchTxError, loading: isConfirming } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()

  const activate = useCallback(async () => {
    const response = await fetchWithCatchTxError(() => {
      return callWithGasPrice(farmBoosterContract, 'activate', [farmPid])
    })

    if (response?.status) {
      // toastSuccess(
      //   t('You have activated the farm!'),
      //   <ToastDescriptionWithTx txHash={response.transactionHash} />,
      // )
    }

    return null
  }, [farmPid, farmBoosterContract, callWithGasPrice, fetchWithCatchTxError])

  const deactivate = useCallback(async () => {
    const response = await fetchWithCatchTxError(() => {
      return callWithGasPrice(farmBoosterContract, 'deactivate', [farmPid])
    })

    if (response?.status) {
      // toastSuccess(
      //   t('You have deactivated the farm!'),
      //   <ToastDescriptionWithTx txHash={response.transactionHash} />,
      // )
    }

    return null
  }, [farmPid, farmBoosterContract, callWithGasPrice, fetchWithCatchTxError])

  return { activate, deactivate }
}

export default useBoosterFarmHandlers
