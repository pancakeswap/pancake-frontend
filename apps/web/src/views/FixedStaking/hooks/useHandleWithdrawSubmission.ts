import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { useFixedStakingContract } from 'hooks/useContract'
import { createElement, useCallback, useMemo } from 'react'
import { UnstakeType } from '../type'

export function useHandleWithdrawSubmission({ poolIndex }: { poolIndex: number }) {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const fixedStakingContract = useFixedStakingContract()

  const handleSubmission = useCallback(
    async (type: UnstakeType) => {
      const receipt = await fetchWithCatchTxError(() => {
        const methodArgs = [poolIndex]

        return callWithGasPrice(fixedStakingContract, type, methodArgs)
      })

      if (receipt?.status) {
        const successComp = createElement(
          ToastDescriptionWithTx,
          { txHash: receipt.transactionHash },
          type === UnstakeType.HARVEST
            ? t('Your harvest request has been submitted.')
            : t('Your funds have been restaked in the pool'),
        )

        toastSuccess(t('Successfully submitted!'), successComp)
      }
    },
    [callWithGasPrice, fetchWithCatchTxError, fixedStakingContract, poolIndex, t, toastSuccess],
  )

  return useMemo(
    () => ({
      handleSubmission,
      pendingTx,
    }),
    [handleSubmission, pendingTx],
  )
}
