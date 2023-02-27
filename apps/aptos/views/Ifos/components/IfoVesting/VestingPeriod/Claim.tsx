import { useTranslation } from '@pancakeswap/localization'
import { AutoRenewIcon, Button, useToast } from '@pancakeswap/uikit'
import { PoolIds } from 'config/constants/types'
import { ifoRelease } from 'views/Ifos/generated/ifo'
import type { VestingData } from 'views/Ifos/hooks/vesting/useFetchUserWalletIfoData'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useIfoPool } from 'views/Ifos/hooks/useIfoPool'
import splitTypeTag from 'utils/splitTypeTag'
import { useCallback, useState } from 'react'
import useSimulationAndSendTransaction from 'hooks/useSimulationAndSendTransaction'
import { HexString } from 'aptos'

interface Props {
  poolId: PoolIds
  data: VestingData
  claimableAmount: string
  fetchUserVestingData: () => void
}

const ClaimButton: React.FC<React.PropsWithChildren<Props>> = ({
  poolId,
  data,
  claimableAmount,
  fetchUserVestingData,
}) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { token } = data.ifo
  const [isPending, setIsPending] = useState(false)
  const executeTransaction = useSimulationAndSendTransaction()
  const ifo = useIfoPool(data.ifo)

  const handleClaim = useCallback(async () => {
    setIsPending(true)

    const { vestingId } = data.userVestingData[poolId]

    const [raisingCoin, offeringCoin, uid] = splitTypeTag(ifo?.type)

    const vestingScheduleIdInArray: number[] = Array.from(new HexString(vestingId).toUint8Array())

    const payload = ifoRelease([vestingScheduleIdInArray], [raisingCoin, offeringCoin, uid])

    try {
      const response = await executeTransaction(payload)

      if (response.hash) {
        toastSuccess(
          t('Success!'),
          <ToastDescriptionWithTx txHash={response.hash}>
            {t('You have successfully claimed available tokens.')}
          </ToastDescriptionWithTx>,
        )
        fetchUserVestingData()
      }
    } finally {
      setIsPending(false)
    }
  }, [data.userVestingData, poolId, ifo?.type, executeTransaction, toastSuccess, t, fetchUserVestingData])

  return (
    <Button
      mt="20px"
      width="100%"
      onClick={handleClaim}
      isLoading={isPending}
      disabled={isPending || claimableAmount === '0'}
      endIcon={isPending ? <AutoRenewIcon spin color="currentColor" /> : null}
    >
      {t('Claim %symbol%', { symbol: token.symbol })}
    </Button>
  )
}

export default ClaimButton
