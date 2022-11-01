import { useCallback } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { Pool, useToast } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'
// import { useAppDispatch } from 'state'
// import { updateUserBalance, updateUserPendingReward, updateUserStakedBalance } from 'state/pools'
import useHarvestPool from '../../hooks/useHarvestPool'

export const CollectModalContainer = ({
  earningTokenSymbol,
  sousId,
  onDismiss,
  stakingTokenAddress,
  earningTokenAddress,
  ...rest
}: React.PropsWithChildren<
  Pool.CollectModalProps & {
    earningTokenAddress: string
    stakingTokenAddress: string
  }
>) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  // const dispatch = useAppDispatch()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { onReward } = useHarvestPool({ stakingTokenAddress, earningTokenAddress, sousId })

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
