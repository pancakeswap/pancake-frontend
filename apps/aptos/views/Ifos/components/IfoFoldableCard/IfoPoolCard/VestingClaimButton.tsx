import { Pair } from '@pancakeswap/aptos-swap-sdk'
import { useSendTransaction } from '@pancakeswap/awgmi'
import { useTranslation } from '@pancakeswap/localization'
import { AutoRenewIcon, Button, useToast } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import { PoolIds } from 'config/constants/types'
import { useCallback } from 'react'
import { IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE } from 'views/Ifos/constants'
import { ifoRelease } from 'views/Ifos/generated/ifo'
import { RootObject as IFOPoolStore } from 'views/Ifos/generated/IFOPoolStore'
import { useIfoResources } from 'views/Ifos/hooks/useIfoResources'
import { WalletIfoData } from 'views/Ifos/types'

interface Props {
  poolId: PoolIds
  amountAvailableToClaim: BigNumber
  walletIfoData: WalletIfoData
}

const ClaimButton: React.FC<React.PropsWithChildren<Props>> = ({ poolId, amountAvailableToClaim, walletIfoData }) => {
  const userPoolCharacteristics = walletIfoData[poolId]
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const resources = useIfoResources()
  const { sendTransactionAsync } = useSendTransaction()

  const setPendingTx = useCallback(
    (isPending: boolean) => {
      return walletIfoData.setPendingTx(isPending, poolId)
    },
    [poolId, walletIfoData],
  )

  const handleClaim = useCallback(async () => {
    setPendingTx(true)

    const [raisingCoin, offeringCoin] = Pair.parseType(
      (resources.data?.[IFO_RESOURCE_ACCOUNT_TYPE_POOL_STORE] as IFOPoolStore).type,
    )
    const payload = ifoRelease([userPoolCharacteristics.vestingId], [raisingCoin, offeringCoin])
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
  }, [poolId, resources, walletIfoData, userPoolCharacteristics, t, setPendingTx, toastSuccess])

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
