import { useTranslation } from '@pancakeswap/localization'
import { Button, useToast } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import useCatchTxError from 'hooks/useCatchTxError'
import { useRevenueSharingPoolContract } from 'hooks/useContract'
import { useCallback, useMemo } from 'react'

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
  const { account, chainId } = useAccountActiveChain()
  const contract = useRevenueSharingPoolContract({ chainId })
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()

  const isReady = useMemo(() => new BigNumber(availableClaim).gt(0) && !isPending, [availableClaim, isPending])

  const handleClaim = useCallback(async () => {
    try {
      if (!account || !chainId) {
        return
      }
      const receipt = await fetchWithCatchTxError(() => contract.write.claim([account], { account, chainId } as any))

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
  if (!isReady) return null
  return (
    <Button mt="24px" width="100%" variant="subtle" disabled={!isReady} onClick={handleClaim}>
      {t('Claim')}
    </Button>
  )
}

export default ClaimButton
