import { useCallback } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { Pool, useToast } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError, { TxResponse } from 'hooks/useCatchTxError'

const CollectModalContainer = ({
  earningTokenSymbol,
  onDismiss,
  onReward,
  onDone,
  ...rest
}: React.PropsWithChildren<
  Pool.CollectModalProps & {
    onReward: () => Promise<TxResponse>
    onDone: () => void
  }
>) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()

  const handleHarvestConfirm = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return onReward()
    })
    if (receipt?.status) {
      toastSuccess(
        `${t('Harvested')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your %symbol% earnings have been sent to your wallet!', { symbol: earningTokenSymbol })}
        </ToastDescriptionWithTx>,
      )

      onDone?.()
      onDismiss?.()
    }
  }, [earningTokenSymbol, fetchWithCatchTxError, onDismiss, onDone, onReward, t, toastSuccess])

  return (
    <Pool.CollectModal
      earningTokenSymbol={earningTokenSymbol}
      onDismiss={onDismiss}
      handleHarvestConfirm={handleHarvestConfirm}
      pendingTx={pendingTx}
      {...rest}
    />
  )
}

export default CollectModalContainer
