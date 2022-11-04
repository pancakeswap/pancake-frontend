import { useCallback } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { Pool, useToast } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError, { TxResponse } from 'hooks/useCatchTxError'
// import { useAppDispatch } from 'state'
// import { updateUserBalance, updateUserPendingReward, updateUserStakedBalance } from 'state/pools'

const CollectModalContainer = ({
  earningTokenSymbol,
  onDismiss,
  onReward,
  ...rest
}: React.PropsWithChildren<
  Pool.CollectModalProps & {
    earningTokenAddress: string
    stakingTokenAddress: string
    onReward: () => Promise<TxResponse>
  }
>) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  // const dispatch = useAppDispatch()
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
      // dispatch(updateUserStakedBalance({ sousId, account }))
      // dispatch(updateUserPendingReward({ sousId, account }))
      // dispatch(updateUserBalance({ sousId, account }))
      onDismiss?.()
    }
  }, [earningTokenSymbol, fetchWithCatchTxError, onDismiss, onReward, t, toastSuccess])

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
