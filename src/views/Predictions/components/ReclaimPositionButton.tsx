import React, { ReactNode, useState } from 'react'
import { AutoRenewIcon, Button, ButtonProps } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { usePredictionsContract } from 'hooks/useContract'
import useToast from 'hooks/useToast'

interface ReclaimPositionButtonProps extends ButtonProps {
  epoch: number
  onSuccess?: () => Promise<void>
  children?: ReactNode
}

const ReclaimPositionButton: React.FC<ReclaimPositionButtonProps> = ({ epoch, onSuccess, children, ...props }) => {
  const [isPendingTx, setIsPendingTx] = useState(false)
  const { t } = useTranslation()
  const predictionsContract = usePredictionsContract()
  const { toastSuccess, toastError } = useToast()

  const handleReclaim = async () => {
    const tx = await predictionsContract.claim(epoch)
    setIsPendingTx(true)

    const receipt = await tx.wait()
    if (receipt.status) {
      if (onSuccess) {
        await onSuccess()
      }
      setIsPendingTx(false)
      toastSuccess(t('Position reclaimed!'))
    } else {
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
