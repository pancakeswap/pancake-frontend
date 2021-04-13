import React, { useState } from 'react'
import { AutoRenewIcon, Button, ButtonProps } from '@pancakeswap-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import useI18n from 'hooks/useI18n'
import { usePredictionsContract } from 'hooks/useContract'
import { useToast } from 'state/hooks'

interface ReclaimPositionButtonProps extends ButtonProps {
  epoch: number
  onSuccess?: () => Promise<void>
}

const ReclaimPositionButton: React.FC<ReclaimPositionButtonProps> = ({ epoch, onSuccess, ...props }) => {
  const [isPendingTx, setIsPendingTx] = useState(false)
  const TranslateString = useI18n()
  const { account } = useWeb3React()
  const predictionsContract = usePredictionsContract()
  const { toastSuccess, toastError } = useToast()

  const handleReclaim = () => {
    predictionsContract.methods
      .claim(epoch)
      .send({ from: account })
      .once('sending', () => {
        setIsPendingTx(true)
      })
      .once('receipt', async () => {
        if (onSuccess) {
          await onSuccess()
        }
        setIsPendingTx(false)
        toastSuccess(TranslateString(999, 'Position reclaimed!'))
      })
      .once('error', (error) => {
        setIsPendingTx(false)
        toastError('Error', error?.message)
        console.error(error)
      })
  }

  return (
    <Button
      onClick={handleReclaim}
      isLoading={isPendingTx}
      endIcon={isPendingTx ? <AutoRenewIcon spin color="white" /> : null}
      {...props}
    >
      {TranslateString(999, 'Reclaim Position')}
    </Button>
  )
}

export default ReclaimPositionButton
