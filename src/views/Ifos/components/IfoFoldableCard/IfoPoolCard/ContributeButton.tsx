import React from 'react'
import { useCurrentBlock } from 'state/block/hooks'
import BigNumber from 'bignumber.js'
import { Button, useModal } from '@pancakeswap/uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import { Ifo, PoolIds } from 'config/constants/types'
import { WalletIfoData, PublicIfoData } from 'views/Ifos/types'
import { useTranslation } from 'contexts/Localization'
import useTokenBalance from 'hooks/useTokenBalance'
import useToast from 'hooks/useToast'
import { ToastDescriptionWithTx } from 'components/Toast'
import GetTokenModal from './GetTokenModal'
import ContributeModal from './ContributeModal'

interface Props {
  poolId: PoolIds
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
}
const ContributeButton: React.FC<Props> = ({ poolId, ifo, publicIfoData, walletIfoData }) => {
  const publicPoolCharacteristics = publicIfoData[poolId]
  const userPoolCharacteristics = walletIfoData[poolId]
  const { isPendingTx, amountTokenCommittedInLP } = userPoolCharacteristics
  const { limitPerUserInLP } = publicPoolCharacteristics
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const currentBlock = useCurrentBlock()
  const { balance: userCurrencyBalance } = useTokenBalance(ifo.currency.address)

  // Refetch all the data, and display a message when fetching is done
  const handleContributeSuccess = async (amount: BigNumber, txHash: string) => {
    await Promise.all([publicIfoData.fetchIfoData(currentBlock), walletIfoData.fetchIfoData()])
    toastSuccess(
      t('Success!'),
      <ToastDescriptionWithTx txHash={txHash}>
        {t('You have contributed %amount% CAKE to this IFO!', {
          amount: getBalanceNumber(amount),
        })}
      </ToastDescriptionWithTx>,
    )
  }

  const [onPresentContributeModal] = useModal(
    <ContributeModal
      poolId={poolId}
      creditLeft={walletIfoData.ifoCredit?.creditLeft}
      ifo={ifo}
      publicIfoData={publicIfoData}
      walletIfoData={walletIfoData}
      onSuccess={handleContributeSuccess}
      userCurrencyBalance={userCurrencyBalance}
    />,
    false,
  )

  const [onPresentGetTokenModal] = useModal(<GetTokenModal currency={ifo.currency} />, false)

  const noNeedCredit = ifo.version === 3.1 && poolId === PoolIds.poolBasic

  const isMaxCommitted =
    (!noNeedCredit &&
      walletIfoData.ifoCredit?.creditLeft &&
      walletIfoData.ifoCredit?.creditLeft.isLessThanOrEqualTo(0)) ||
    (limitPerUserInLP.isGreaterThan(0) && amountTokenCommittedInLP.isGreaterThanOrEqualTo(limitPerUserInLP))

  const isDisabled = isPendingTx || isMaxCommitted || publicIfoData.status !== 'live'

  return (
    <Button
      onClick={userCurrencyBalance.isEqualTo(0) ? onPresentGetTokenModal : onPresentContributeModal}
      width="100%"
      disabled={isDisabled}
    >
      {isMaxCommitted && publicIfoData.status === 'live' ? t('Max. Committed') : t('Commit CAKE')}
    </Button>
  )
}

export default ContributeButton
