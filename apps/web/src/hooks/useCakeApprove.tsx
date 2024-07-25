import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCake } from 'hooks/useContract'
import { useCallback } from 'react'

const useCakeApprove = (setLastUpdated: () => void, spender, successMsg) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const cakeContract = useCake()

  const handleApprove = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(cakeContract, 'approve', [spender, MaxUint256])
    })
    if (receipt?.status) {
      toastSuccess(
        t('Contract Enabled'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>{successMsg}</ToastDescriptionWithTx>,
      )
      setLastUpdated()
    }
  }, [cakeContract, spender, fetchWithCatchTxError, callWithGasPrice, t, toastSuccess, successMsg, setLastUpdated])

  return { handleApprove, pendingTx }
}

export default useCakeApprove
