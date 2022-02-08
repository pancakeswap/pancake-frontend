import React, { ReactNode } from 'react'
import { AutoRenewIcon, Button, ButtonProps } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { usePredictionsContract } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'

interface ReclaimPositionButtonProps extends ButtonProps {
  epoch: number
  onSuccess?: () => Promise<void>
  children?: ReactNode
}

const ReclaimPositionButton: React.FC<ReclaimPositionButtonProps> = ({ epoch, onSuccess, children, ...props }) => {
  const { t } = useTranslation()
  const predictionsContract = usePredictionsContract()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: isPendingTx } = useCatchTxError()

  const handleReclaim = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(predictionsContract, 'claim', [[epoch]])
    })
    if (receipt?.status) {
      if (onSuccess) {
        await onSuccess()
      }
      toastSuccess(t('Position reclaimed!'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
    }
  }

  return (
    <Button
      onClick={handleReclaim}
      isLoading={isPendingTx}
      endIcon={isPendingTx ? <AutoRenewIcon spin color="white" /> : null}
      {...props}
    >
      {children || t('Reclaim Position')}
    </Button>
  )
}

export default ReclaimPositionButton
