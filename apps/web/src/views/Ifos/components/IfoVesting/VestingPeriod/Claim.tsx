import { useTranslation } from '@pancakeswap/localization'
import { AutoRenewIcon, Button, useToast } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import { PoolIds } from 'config/constants/types'
import useCatchTxError from 'hooks/useCatchTxError'
import { useIfoV3Contract } from 'hooks/useContract'
import { useCallback, useMemo } from 'react'
import { VestingData } from 'views/Ifos/hooks/vesting/fetchUserWalletIfoData'

interface Props {
  poolId: PoolIds
  data: VestingData
  claimableAmount: string
  isVestingInitialized: boolean
  fetchUserVestingData: () => void
}

const ClaimButton: React.FC<React.PropsWithChildren<Props>> = ({
  poolId,
  data,
  claimableAmount,
  isVestingInitialized,
  fetchUserVestingData,
}) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { address, token } = data.ifo
  const contract = useIfoV3Contract(address)
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()

  const isReady = useMemo(() => {
    const checkClaimableAmount = isVestingInitialized ? claimableAmount === '0' : false
    return isPending || checkClaimableAmount
  }, [isPending, isVestingInitialized, claimableAmount])

  const handleClaim = useCallback(async () => {
    const { vestingId } = data.userVestingData[poolId]
    const methods = isVestingInitialized
      ? contract.release(vestingId)
      : contract.harvestPool(poolId === PoolIds.poolBasic ? 0 : 1)
    const receipt = await fetchWithCatchTxError(() => methods)

    if (receipt?.status) {
      toastSuccess(
        t('Success!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You have successfully claimed available tokens.')}
        </ToastDescriptionWithTx>,
      )
      fetchUserVestingData()
    }
  }, [isVestingInitialized, data, poolId, contract, t, fetchUserVestingData, fetchWithCatchTxError, toastSuccess])

  return (
    <Button
      mt="20px"
      width="100%"
      onClick={handleClaim}
      isLoading={isPending}
      disabled={isReady}
      endIcon={isPending ? <AutoRenewIcon spin color="currentColor" /> : null}
    >
      {t('Claim %symbol%', { symbol: token.symbol })}
    </Button>
  )
}

export default ClaimButton
