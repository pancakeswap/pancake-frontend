import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { AutoRenewIcon, Button } from '@pancakeswap/uikit'
import { PoolIds } from 'config/constants/types'
import { WalletIfoData } from 'hooks/ifo/types'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'

interface Props {
  poolId: PoolIds
  walletIfoData: WalletIfoData
}

const ClaimButton: React.FC<Props> = ({ poolId, walletIfoData }) => {
  const userPoolCharacteristics = walletIfoData[poolId]
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { toastError, toastSuccess } = useToast()

  const setPendingTx = (isPending: boolean) => walletIfoData.setPendingTx(isPending, poolId)

  const handleClaim = async () => {
    try {
      setPendingTx(true)
      await walletIfoData.contract.methods.harvestPool(poolId === PoolIds.poolBasic ? 0 : 1).send({ from: account })
      walletIfoData.setIsClaimed(poolId)
      toastSuccess('Success!', 'You have successfully claimed your rewards.')
    } catch (error) {
      toastError('Error', error?.message)
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
