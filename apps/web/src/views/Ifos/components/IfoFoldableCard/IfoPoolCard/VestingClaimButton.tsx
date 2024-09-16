import { PoolIds } from '@pancakeswap/ifos'
import { useTranslation } from '@pancakeswap/localization'
import { AutoRenewIcon, Button, useToast } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallback } from 'react'
import { Address } from 'viem'
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
  const { account, chain } = useWeb3React()
  const { fetchWithCatchTxError } = useCatchTxError()

  const setPendingTx = useCallback(
    (isPending: boolean) => {
      return walletIfoData.setPendingTx(isPending, poolId)
    },
    [poolId, walletIfoData],
  )

  const handleClaim = useCallback(async () => {
    if (walletIfoData.version !== 3 && walletIfoData.version !== 7 && walletIfoData.version !== 8) {
      throw new Error('Invalid IFO version')
    }
    const receipt = await fetchWithCatchTxError(() => {
      setPendingTx(true)
      if (!account || !walletIfoData.contract) {
        throw new Error('Invalid wallet ifo contract or account')
      }
      return walletIfoData.version === 3
        ? walletIfoData.contract.write.release([userPoolCharacteristics?.vestingId as Address], { account, chain })
        : walletIfoData.version === 8
        ? walletIfoData.contract.write.release([userPoolCharacteristics?.vestingId as Address], { account, chain })
        : walletIfoData.contract.write.release([userPoolCharacteristics?.vestingId as Address], { account, chain })
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
  }, [
    walletIfoData,
    fetchWithCatchTxError,
    setPendingTx,
    userPoolCharacteristics?.vestingId,
    account,
    chain,
    poolId,
    toastSuccess,
    t,
  ])

  return (
    <Button
      width="100%"
      onClick={handleClaim}
      isLoading={userPoolCharacteristics?.isPendingTx}
      disabled={amountAvailableToClaim.lte(0) || userPoolCharacteristics?.isPendingTx}
      endIcon={userPoolCharacteristics?.isPendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
    >
      {t('Claim')}
    </Button>
  )
}

export default ClaimButton
