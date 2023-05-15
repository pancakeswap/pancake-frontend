import { useTranslation } from '@pancakeswap/localization'
import { AutoRenewIcon, Button, useToast } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { ToastDescriptionWithTx } from 'components/Toast'
import { PoolIds } from 'config/constants/types'
import useCatchTxError from 'hooks/useCatchTxError'
import { WalletIfoData } from 'views/Ifos/types'

interface Props {
  poolId: PoolIds
  ifoVersion: number
  walletIfoData: WalletIfoData
}

const ClaimButton: React.FC<React.PropsWithChildren<Props>> = ({ poolId, ifoVersion, walletIfoData }) => {
  const userPoolCharacteristics = walletIfoData[poolId]
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { account, chain } = useWeb3React()
  const { fetchWithCatchTxError } = useCatchTxError()

  const setPendingTx = (isPending: boolean) => walletIfoData.setPendingTx(isPending, poolId)

  const handleClaim = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      setPendingTx(true)
      return ifoVersion === 1 && walletIfoData.version === 1
        ? walletIfoData.contract.write.harvest({ account, chain })
        : walletIfoData.version === 3 &&
            walletIfoData.contract.write.harvestPool([poolId === PoolIds.poolBasic ? 0 : 1], { account, chain })
    })
    if (receipt?.status) {
      walletIfoData.setIsClaimed(poolId)
      toastSuccess(
        t('Success!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
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

export default ClaimButton
