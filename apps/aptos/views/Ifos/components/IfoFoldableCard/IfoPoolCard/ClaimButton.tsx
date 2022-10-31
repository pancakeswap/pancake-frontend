import { Pair } from '@pancakeswap/aptos-swap-sdk'
import { useSendTransaction } from '@pancakeswap/awgmi'
import { useTranslation } from '@pancakeswap/localization'
import { AutoRenewIcon, Button, useToast } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import { PoolIds } from 'config/constants/types'
import { IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE } from 'views/Ifos/constants'
import { ifoHarvestPool } from 'views/Ifos/generated/ifo'
import { RootObject as IFOPool } from 'views/Ifos/generated/IFOPool'
import { RootObject as IFOPoolStore } from 'views/Ifos/generated/IFOPoolStore'
import { useIfoPool } from 'views/Ifos/hooks/useIfoPool'
import { useIfoResources } from 'views/Ifos/hooks/useIfoResources'
import { WalletIfoData } from 'views/Ifos/types'

interface Props {
  poolId: PoolIds
  walletIfoData: WalletIfoData
}

export const ClaimButton: React.FC<React.PropsWithChildren<Props>> = ({ poolId, walletIfoData }) => {
  const userPoolCharacteristics = walletIfoData[poolId]

  const resources = useIfoResources()
  const { t } = useTranslation()
  const { sendTransactionAsync } = useSendTransaction()
  const { toastSuccess } = useToast()
  const pool = useIfoPool()

  const setPendingTx = (isPending: boolean) => walletIfoData.setPendingTx(isPending, poolId)

  const handleClaim = async () => {
    const [raisingCoin, offeringCoin] = Pair.parseType(
      (resources.data?.[IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE] as IFOPoolStore).type,
    )
    const payload = ifoHarvestPool([(pool.data as IFOPool).pid], [raisingCoin, offeringCoin])
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
      disabled={userPoolCharacteristics.isPendingTx}
      width="100%"
      isLoading={userPoolCharacteristics.isPendingTx}
      endIcon={userPoolCharacteristics.isPendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
    >
      {t('Claim')}
    </Button>
  )
}
