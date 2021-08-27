import React from 'react'
import { AutoRenewIcon, Button } from '@pancakeswap/uikit'
import { PoolIds } from 'config/constants/types'
import { WalletIfoData } from 'views/Ifos/types'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import { ToastDescriptionWithTx } from 'components/Toast'

interface Props {
  poolId: PoolIds
  ifoVersion: number
  walletIfoData: WalletIfoData
}

const ClaimButton: React.FC<Props> = ({ poolId, ifoVersion, walletIfoData }) => {
  const userPoolCharacteristics = walletIfoData[poolId]
  const { t } = useTranslation()
  const { toastError, toastSuccess } = useToast()

  const setPendingTx = (isPending: boolean) => walletIfoData.setPendingTx(isPending, poolId)

  const handleClaim = async () => {
    try {
      let txHash
      setPendingTx(true)

      if (ifoVersion === 1) {
        const tx = await walletIfoData.contract.harvest()
        const receipt = await tx.wait()
        txHash = receipt.transactionHash
      } else {
        const tx = await walletIfoData.contract.harvestPool(poolId === PoolIds.poolBasic ? 0 : 1)
        const receipt = await tx.wait()
        txHash = receipt.transactionHash
      }

      walletIfoData.setIsClaimed(poolId)
      toastSuccess(
        t('Success!'),
        <ToastDescriptionWithTx txHash={txHash}>
          {t('You have successfully claimed your rewards.')}
        </ToastDescriptionWithTx>,
      )
    } catch (error) {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      console.error(error)
    } finally {
      setPendingTx(false)
    }
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
