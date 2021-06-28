import React from 'react'
import { AutoRenewIcon, Button } from '@pancakeswap/uikit'
import { PoolIds } from 'config/constants/types'
import { WalletIfoData } from 'views/Ifos/types'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'

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
      setPendingTx(true)

      if (ifoVersion === 1) {
        const tx = await walletIfoData.contract.harvest()
        await tx.wait()
      } else {
        const tx = await walletIfoData.contract.harvestPool(poolId === PoolIds.poolBasic ? 0 : 1)
        await tx.wait()
      }

      walletIfoData.setIsClaimed(poolId)
      toastSuccess(t('Success!'), t('You have successfully claimed your rewards.'))
    } catch (error) {
      toastError(t('Error'), error?.message)
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
