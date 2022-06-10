import { useCallback } from 'react'
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
  const contract = useIfoV3Contract(address)
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()

  const handleClaim = useCallback(async () => {
    const pids = [PoolIds.poolUnlimited, PoolIds.poolBasic]
      .map((pool) => {
        const detail = data.userVestingData[pool]
        if (detail.vestingcomputeReleasableAmount.gt(0)) {
          return detail.vestingId
        }
        return ''
      })
      .filter(Boolean)

    for (let i = 0; i < pids.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      const receipt = await fetchWithCatchTxError(() => contract.release(pids[i]))

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
  }, [data, contract, t, fetchUserVestingData, fetchWithCatchTxError, toastSuccess])

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
