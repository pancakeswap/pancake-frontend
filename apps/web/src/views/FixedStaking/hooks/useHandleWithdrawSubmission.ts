import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { useFixedStakingContract } from 'hooks/useContract'
import { createElement, useCallback, useMemo } from 'react'

export function useHandleWithdrawSubmission({ poolIndex }: { poolIndex: number }) {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const fixedStakingContract = useFixedStakingContract()

  const handleSubmission = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      const methodArgs = [poolIndex]

      return callWithGasPrice(fixedStakingContract, 'withdraw', methodArgs)
    })

    if (receipt?.status) {
      const successComp = createElement(
        ToastDescriptionWithTx,
        { txHash: receipt.transactionHash },
        t('Your harvest request has been submitted.'),
      )

      toastSuccess(t('Successfully submitted!'), successComp)
    }
  }, [callWithGasPrice, fetchWithCatchTxError, fixedStakingContract, poolIndex, t, toastSuccess])

  return useMemo(
    () => ({
      handleSubmission,
      pendingTx,
    }),
    [handleSubmission, pendingTx],
  )
}
