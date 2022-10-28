import { useTranslation } from '@pancakeswap/localization'
import { AutoRenewIcon, Button } from '@pancakeswap/uikit'
// import { ToastDescriptionWithTx } from 'components/Toast'
import { PoolIds } from 'config/constants/types'
import useCatchTxError from 'hooks/useCatchTxError'
// import { useIfoV3Contract } from 'hooks/useContract'
import { VestingData } from 'views/Ifos/hooks/vesting/fetchUserWalletIfoData'

interface Props {
  poolId: PoolIds
  data: VestingData
  claimableAmount: string
  fetchUserVestingData: () => void
}

const ClaimButton: React.FC<React.PropsWithChildren<Props>> = ({
  // poolId,
  data,
  claimableAmount,
  // fetchUserVestingData,
}) => {
  const { t } = useTranslation()
  // const { toastSuccess } = useToast()
  const { token } = data.ifo
  // const contract = useIfoV3Contract(address)
  const { loading: isPending } = useCatchTxError()

  // const handleClaim = useCallback(async () => {
  //   const { vestingId } = data.userVestingData[poolId]
  //   const receipt = await fetchWithCatchTxError(() => contract.release(vestingId))

  //   if (receipt?.status) {
  //     toastSuccess(
  //       t('Success!'),
  //       <ToastDescriptionWithTx txHash={receipt.transactionHash}>
  //         {t('You have successfully claimed available tokens.')}
  //       </ToastDescriptionWithTx>,
  //     )
  //     fetchUserVestingData()
  //   }
  // }, [data, poolId, contract, t, fetchUserVestingData, fetchWithCatchTxError, toastSuccess])

  return (
    <Button
      mt="20px"
      width="100%"
      // onClick={handleClaim}
      isLoading={isPending}
      disabled={isPending || claimableAmount === '0'}
      endIcon={isPending ? <AutoRenewIcon spin color="currentColor" /> : null}
    >
      {t('Claim %symbol%', { symbol: token.symbol })}
    </Button>
  )
}

export default ClaimButton
