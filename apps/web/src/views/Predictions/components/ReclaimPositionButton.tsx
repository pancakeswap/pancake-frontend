import { useTranslation } from '@pancakeswap/localization'
import { AutoRenewIcon, Button, ButtonProps, useToast } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { usePredictionsContract } from 'hooks/useContract'
import { ReactNode } from 'react'
import { useConfig } from '../context/ConfigProvider'

interface ReclaimPositionButtonProps extends ButtonProps {
  epoch: number
  onSuccess?: () => Promise<void>
  children?: ReactNode
}

const ReclaimPositionButton: React.FC<React.PropsWithChildren<ReclaimPositionButtonProps>> = ({
  epoch,
  onSuccess,
  children,
  ...props
}) => {
  const { t } = useTranslation()
  const config = useConfig()
  const predictionsAddress = config?.address ?? '0x'
  const isNativeToken = config?.isNativeToken ?? false

  const predictionsContract = usePredictionsContract(predictionsAddress, isNativeToken)
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: isPendingTx } = useCatchTxError()

  const handleReclaim = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(predictionsContract as any, 'claim', [[epoch]])
    })
    if (receipt?.status) {
      await onSuccess?.()
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
