import { useTranslation } from '@pancakeswap/localization'
import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { useToast } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTokenContract } from 'hooks/useContract'
import { useCallback } from 'react'
import { Address } from 'viem'

interface UseLiquidStakingApproveProps {
  approveToken?: string
  contractAddress?: string
}

export const useLiquidStakingApprove = ({ approveToken, contractAddress }: UseLiquidStakingApproveProps) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()

  const tokenContract = useTokenContract(approveToken as Address)

  const onApprove = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(tokenContract, 'approve', [contractAddress as Address, MaxUint256])
    })

    if (receipt?.status) {
      toastSuccess(
        t('Success!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Please progress to the next step.')}
        </ToastDescriptionWithTx>,
      )
    }
  }, [fetchWithCatchTxError, callWithGasPrice, tokenContract, contractAddress, toastSuccess, t])

  return { isPending, onApprove }
}
