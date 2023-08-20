import { useCallback, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useTranslation } from '@pancakeswap/localization'
import { Button, useToast } from '@pancakeswap/uikit'
import useCatchTxError from 'hooks/useCatchTxError'
import { useRevenueSharingPoolContract } from 'hooks/useContract'
import { ToastDescriptionWithTx } from 'components/Toast'
import useAccountActiveChain from 'hooks/useAccountActiveChain'

interface ClaimButtonProps {
  availableClaim: string
  onDismiss?: () => void
}

const ClaimButton: React.FunctionComponent<React.PropsWithChildren<ClaimButtonProps>> = ({
  availableClaim,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { chainId, account } = useAccountActiveChain()
  const contract = useRevenueSharingPoolContract({ chainId })
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()

  const isReady = useMemo(() => new BigNumber(availableClaim).gt(0) && !isPending, [availableClaim, isPending])

  const handleClaim = useCallback(async () => {
    try {
      const receipt = await fetchWithCatchTxError(() => contract.write.claim([account], { account, chainId }))

      if (receipt?.status) {
        toastSuccess(
          t('Success!'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('You have successfully claimed your rewards.')}
          </ToastDescriptionWithTx>,
        )

        onDismiss?.()
      }
    } catch (error) {
      console.error('[ERROR] Submit Revenue Claim Button', error)
    }
  }, [account, chainId, contract, fetchWithCatchTxError, onDismiss, t, toastSuccess])

  return (
    <Button mt="24px" width="100%" variant="subtle" disabled={!isReady} onClick={handleClaim}>
      {t('Claim')}
    </Button>
  )
}

export default ClaimButton
