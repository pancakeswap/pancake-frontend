import { useCallback } from 'react'
import { AutoRenewIcon, Button } from '@pancakeswap/uikit'
import { PoolIds } from 'config/constants/types'
import { WalletIfoData } from 'views/Ifos/types'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import BigNumber from 'bignumber.js'

interface Props {
  poolId: PoolIds
  amountAvailableToClaim: BigNumber
  walletIfoData: WalletIfoData
}

const ClaimButton: React.FC<Props> = ({ poolId, amountAvailableToClaim, walletIfoData }) => {
  const userPoolCharacteristics = walletIfoData[poolId]
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError } = useCatchTxError()

  const setPendingTx = useCallback(
    (isPending: boolean) => {
      return walletIfoData.setPendingTx(isPending, poolId)
    },
    [poolId, walletIfoData],
  )

  const handleClaim = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      setPendingTx(true)
      return walletIfoData.contract.release(userPoolCharacteristics.vestingId)
    })
    if (receipt?.status) {
      walletIfoData.setIsClaimed(poolId)
      toastSuccess(
        t('Success!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You have successfully claimed available tokens.')}
        </ToastDescriptionWithTx>,
      )
    }
    setPendingTx(false)
  }, [poolId, walletIfoData, userPoolCharacteristics, t, fetchWithCatchTxError, setPendingTx, toastSuccess])

  return (
    <Button
      width="100%"
      onClick={handleClaim}
      isLoading={userPoolCharacteristics.isPendingTx}
      disabled={amountAvailableToClaim.lte(0) || userPoolCharacteristics.isPendingTx}
      endIcon={userPoolCharacteristics.isPendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
    >
      {t('Claim')}
    </Button>
  )
}

export default ClaimButton
