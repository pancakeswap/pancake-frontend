import { AutoRenewIcon, Button } from '@pancakeswap/uikit'
import { PoolIds } from 'config/constants/types'
import { WalletIfoData } from 'views/Ifos/types'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'

interface Props {
  poolId: PoolIds
  walletIfoData: WalletIfoData
}

const ClaimButton: React.FC<Props> = ({ poolId, walletIfoData }) => {
  const userPoolCharacteristics = walletIfoData[poolId]
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError } = useCatchTxError()

  const setPendingTx = (isPending: boolean) => walletIfoData.setPendingTx(isPending, poolId)

  const handleClaim = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      setPendingTx(true)
      return walletIfoData.contract.release(userPoolCharacteristics.vestingId)
    })
    if (receipt?.status) {
      walletIfoData.setIsClaimed(poolId)
      toastSuccess(
        t('Success!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You have successfully claimed your rewards.')}
        </ToastDescriptionWithTx>,
      )
    }
    setPendingTx(false)
  }

  return (
    <Button
      onClick={handleClaim}
      disabled={userPoolCharacteristics.isPendingTx}
      width="100%"
      isLoading={userPoolCharacteristics.isPendingTx}
      endIcon={userPoolCharacteristics.isPendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
    >
      {t('Claim')}
    </Button>
  )
}

export default ClaimButton
