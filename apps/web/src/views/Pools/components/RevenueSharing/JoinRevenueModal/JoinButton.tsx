import { useCallback } from 'react'
import { Button, useToast } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import useCatchTxError from 'hooks/useCatchTxError'
import { useVCakeContract } from 'hooks/useContract'
import { ToastDescriptionWithTx } from 'components/Toast'
import useAccountActiveChain from 'hooks/useAccountActiveChain'

interface JoinButtonProps {
  refresh?: () => void
  onDismiss?: () => void
}

const JoinButton: React.FunctionComponent<React.PropsWithChildren<JoinButtonProps>> = ({ refresh, onDismiss }) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { chainId } = useAccountActiveChain()
  const vCakeContract = useVCakeContract({ chainId })
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()

  const handleJoinButton = useCallback(async () => {
    try {
      const receipt = await fetchWithCatchTxError(() => vCakeContract.write.syncFromCakePool([]))

      if (receipt?.status) {
        toastSuccess(
          t('Success!'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Joined Revenue Sharing Pool.')}
          </ToastDescriptionWithTx>,
        )
        await refresh?.()
        onDismiss?.()
      }
    } catch (error) {
      console.error('[ERROR] Submit vCake syncFromCakePool', error)
    }
  }, [fetchWithCatchTxError, onDismiss, refresh, t, toastSuccess, vCakeContract.write])

  return (
    <Button width="100%" m="24px 0 8px 0" disabled={isPending} onClick={handleJoinButton}>
      {t('Update Staking Position')}
    </Button>
  )
}

export default JoinButton
