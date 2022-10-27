import { useTranslation } from '@pancakeswap/localization'
import { Button, useModal, useToast } from '@pancakeswap/uikit'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import { Ifo, PoolIds } from 'config/constants/types'
import { useCurrencyBalance } from 'hooks/Balances'
import { useMemo } from 'react'
import { PublicIfoData, WalletIfoData } from 'views/Ifos/types'
import ContributeModal from './ContributeModal'
import GetTokenModal from './GetTokenModal'

interface Props {
  poolId: PoolIds
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
}

const ContributeButton: React.FC<React.PropsWithChildren<Props>> = ({ poolId, ifo, publicIfoData, walletIfoData }) => {
  const publicPoolCharacteristics = publicIfoData[poolId]
  const userPoolCharacteristics = walletIfoData[poolId]
  const { isPendingTx, amountTokenCommittedInLP } = userPoolCharacteristics
  const { limitPerUserInLP } = publicPoolCharacteristics
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const currencyBalance = useCurrencyBalance(ifo.currency.address)

  const balance = useMemo(
    () => (currencyBalance ? new BigNumber(currencyBalance.quotient.toString()) : BIG_ZERO),
    [currencyBalance],
  )

  // Refetch all the data, and display a message when fetching is done
  const handleContributeSuccess = async (amount: BigNumber, txHash: string) => {
    await Promise.all([publicIfoData.fetchIfoData(), walletIfoData.fetchIfoData()])
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
      creditLeft={walletIfoData.ifoCredit?.creditLeft ?? BIG_ZERO}
      ifo={ifo}
      publicIfoData={publicIfoData}
      walletIfoData={walletIfoData}
      onSuccess={handleContributeSuccess}
      userCurrencyBalance={balance}
    />,
    false,
  )

  const [onPresentGetTokenModal] = useModal(<GetTokenModal currency={ifo.currency} />, false)

  // const noNeedCredit = ifo.version >= 3.1 && poolId === PoolIds.poolBasic
  const noNeedCredit = true

  const isMaxCommitted =
    (!noNeedCredit &&
      walletIfoData.ifoCredit?.creditLeft &&
      walletIfoData.ifoCredit?.creditLeft.isLessThanOrEqualTo(0)) ||
    (limitPerUserInLP.isGreaterThan(0) && amountTokenCommittedInLP.isGreaterThanOrEqualTo(limitPerUserInLP))

  const isDisabled = isPendingTx || isMaxCommitted || publicIfoData.status !== 'live'

  return (
    <Button
      onClick={balance.isEqualTo(0) ? onPresentGetTokenModal : onPresentContributeModal}
      width="100%"
      disabled={isDisabled}
    >
      {isMaxCommitted && publicIfoData.status === 'live' ? t('Max. Committed') : t('Commit CAKE')}
    </Button>
  )
}

export default ContributeButton
