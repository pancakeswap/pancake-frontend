import { useSendTransaction } from '@pancakeswap/awgmi'
import { useTranslation } from '@pancakeswap/localization'
import { AutoRenewIcon, Button, useToast } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import { PoolIds } from 'config/constants/types'
import splitTypeTag from 'utils/splitTypeTag'
import { ifoHarvestPool } from 'views/Ifos/generated/ifo'

import { useIfoPool } from 'views/Ifos/hooks/useIfoPool'
import { WalletIfoData } from 'views/Ifos/types'

interface Props {
  poolId: PoolIds
  walletIfoData: WalletIfoData
}

export const ClaimButton: React.FC<React.PropsWithChildren<Props>> = ({ poolId, walletIfoData }) => {
  const userPoolCharacteristics = walletIfoData[poolId]

  const { t } = useTranslation()
  const { sendTransactionAsync } = useSendTransaction()
  const { toastSuccess } = useToast()
  const pool = useIfoPool()

  const setPendingTx = (isPending: boolean) => walletIfoData.setPendingTx(isPending, poolId)

  const handleClaim = async () => {
    const [raisingCoin, offeringCoin, uid] = splitTypeTag(pool?.type)
    const payload = ifoHarvestPool([raisingCoin, offeringCoin, uid])
    const response = await sendTransactionAsync({ payload })
    if (response.hash) {
      walletIfoData.setIsClaimed(poolId)
      toastSuccess(
        t('Success!'),
        <ToastDescriptionWithTx txHash={response.hash}>
          {t('You have successfully claimed available tokens.')}
        </ToastDescriptionWithTx>,
      )
    }
    setPendingTx(false)
  }

  return (
    <Button
      onClick={handleClaim}
      disabled={!pool?.data || userPoolCharacteristics.isPendingTx}
      width="100%"
      isLoading={userPoolCharacteristics.isPendingTx}
      endIcon={userPoolCharacteristics.isPendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
    >
      {t('Claim')}
    </Button>
  )
}
