import { useCallback } from 'react'
import { useToast } from '@pancakeswap/uikit'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { ToastDescriptionWithTx } from 'components/Toast'
import { MaxUint256 } from '@ethersproject/constants'
import { useCallWithMarketGasPrice } from 'hooks/useCallWithMarketGasPrice'
import { useCake } from 'hooks/useContract'

export const useApprovePottery = (potteryVaultAddress: string) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()
  const { callWithMarketGasPrice } = useCallWithMarketGasPrice()
  const { signer: cakeContract } = useCake()

  const onApprove = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithMarketGasPrice(cakeContract, 'approve', [potteryVaultAddress, MaxUint256])
    })

    if (receipt?.status) {
      toastSuccess(
        t('Success!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Please progress to the next step.')}
        </ToastDescriptionWithTx>,
      )
    }
  }, [potteryVaultAddress, cakeContract, t, callWithMarketGasPrice, fetchWithCatchTxError, toastSuccess])

  return { isPending, onApprove }
}
