import { AutoRenewIcon, Button } from '@pancakeswap/uikit'
import { PoolIds } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import { VestingData } from 'views/Ifos/hooks/vesting/fetchUserWalletIfoData'
import { useIfoV3Contract } from 'hooks/useContract'

interface Props {
  data: VestingData
  fetchUserVestingData: () => void
}

const ClaimButton: React.FC<Props> = ({ data, fetchUserVestingData }) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { address, token } = data.ifo
  const { vestingId } = data.userVestingData[PoolIds.poolUnlimited]
  const contract = useIfoV3Contract(address)
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()

  const handleClaim = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return contract.release(vestingId)
    })
    if (receipt?.status) {
      toastSuccess(
        t('Success!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You have successfully claimed available tokens.')}
        </ToastDescriptionWithTx>,
      )
      fetchUserVestingData()
    }
  }

  return (
    <Button
      width="57%"
      onClick={handleClaim}
      isLoading={isPending}
      disabled={isPending}
      endIcon={isPending ? <AutoRenewIcon spin color="currentColor" /> : null}
    >
      {t('Claim %symbol%', { symbol: token.symbol })}
    </Button>
  )
}

export default ClaimButton
