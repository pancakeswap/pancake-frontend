import { useTranslation } from '@pancakeswap/localization'
import { AutoRenewIcon, Button, useToast } from '@pancakeswap/uikit'
import { HexString } from '@pancakeswap/awgmi'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import { Ifo, PoolIds } from 'config/constants/types'
import useSimulationAndSendTransaction from 'hooks/useSimulationAndSendTransaction'
import { useCallback } from 'react'
import splitTypeTag from 'utils/splitTypeTag'
import { ifoRelease } from 'views/Ifos/generated/ifo'
import { useIfoPool } from 'views/Ifos/hooks/useIfoPool'
import { WalletIfoData } from 'views/Ifos/types'

interface Props {
  poolId: PoolIds
  amountAvailableToClaim: BigNumber
  walletIfoData: WalletIfoData
  ifo: Ifo
}

const VestingClaimButton: React.FC<React.PropsWithChildren<Props>> = ({
  ifo,
  poolId,
  amountAvailableToClaim,
  walletIfoData,
}) => {
  const userPoolCharacteristics = walletIfoData[poolId]
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const executeTransaction = useSimulationAndSendTransaction()
  const pool = useIfoPool(ifo)

  const setPendingTx = useCallback(
    (isPending: boolean) => {
      return walletIfoData.setPendingTx(isPending, poolId)
    },
    [poolId, walletIfoData],
  )

  const handleClaim = useCallback(async () => {
    setPendingTx(true)

    const [raisingCoin, offeringCoin, uid] = splitTypeTag(pool?.type)

    const vestingScheduleIdInArray: number[] = Array.from(
      new HexString(userPoolCharacteristics.vestingId).toUint8Array(),
    )

    const payload = ifoRelease([vestingScheduleIdInArray], [raisingCoin, offeringCoin, uid])
    try {
      const response = await executeTransaction(payload)

      if (response.hash) {
        walletIfoData.setIsClaimed(poolId)
        toastSuccess(
          t('Success!'),
          <ToastDescriptionWithTx txHash={response.hash}>
            {t('You have successfully claimed available tokens.')}
          </ToastDescriptionWithTx>,
        )
      }
    } finally {
      setPendingTx(false)
    }
  }, [
    setPendingTx,
    pool?.type,
    userPoolCharacteristics.vestingId,
    executeTransaction,
    walletIfoData,
    poolId,
    toastSuccess,
    t,
  ])

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

export default VestingClaimButton
