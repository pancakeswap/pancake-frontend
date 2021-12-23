import React, { ReactNode, useState } from 'react'
import { AutoRenewIcon, Button, ButtonProps } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { usePredictionsContract } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { logError } from 'utils/sentry'

interface ReclaimPositionButtonProps extends ButtonProps {
  epoch: number
  onSuccess?: () => Promise<void>
  children?: ReactNode
}

const ReclaimPositionButton: React.FC<ReclaimPositionButtonProps> = ({ epoch, onSuccess, children, ...props }) => {
  const [isPendingTx, setIsPendingTx] = useState(false)
  const { t } = useTranslation()
  const predictionsContract = usePredictionsContract()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess, toastError } = useToast()

  const handleReclaim = async () => {
    try {
      const tx = await callWithGasPrice(predictionsContract, 'claim', [[epoch]])
      toastSuccess(`${t('Transaction Submitted')}!`, <ToastDescriptionWithTx txHash={tx.hash} />)
      setIsPendingTx(true)

      const receipt = await tx.wait()
      if (receipt.status) {
        if (onSuccess) {
          await onSuccess()
        }
        toastSuccess(t('Position reclaimed!'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      } else {
        toastError(
          t('Error'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Please try again. Confirm the transaction and make sure you are paying enough gas!')}
          </ToastDescriptionWithTx>,
        )
      }
    } catch (error) {
      const err = error as any
      logError(error)
      toastError(
        t('Error'),
        err?.data?.message || t('Please try again. Confirm the transaction and make sure you are paying enough gas!'),
      )
    } finally {
      setIsPendingTx(false)
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
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
