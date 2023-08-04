import { useCallback } from 'react'
import { useToast } from '@pancakeswap/uikit'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { ToastDescriptionWithTx } from 'components/Toast'
import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { Address } from 'viem'
import { useTokenContract } from 'hooks/useContract'

interface UseLiquidStakingApproveProps {
  tokenAddress: string
  contractAddress: string
}

export const useLiquidStakingApprove = ({ tokenAddress, contractAddress }: UseLiquidStakingApproveProps) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()

  const tokenContract = useTokenContract(tokenAddress as Address)

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
