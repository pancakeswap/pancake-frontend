import { Ifo, PoolIds } from '@pancakeswap/ifos'
import { useTranslation } from '@pancakeswap/localization'
import { Button, IfoGetTokenModal, useModal, useToast } from '@pancakeswap/uikit'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { getTokenListTokenUrl, getTokenLogoURLByAddress } from '@pancakeswap/widgets-internal'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useTokenBalanceByChain } from 'hooks/useTokenBalance'
import { useMemo } from 'react'
import { useCurrentBlock } from 'state/block/hooks'
import { PublicIfoData, WalletIfoData } from 'views/Ifos/types'

import ContributeModal from './ContributeModal'

interface Props {
  poolId: PoolIds
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
  disabled?: boolean
}
const ContributeButton: React.FC<React.PropsWithChildren<Props>> = ({
  poolId,
  ifo,
  publicIfoData,
  walletIfoData,
  disabled,
}) => {
  const publicPoolCharacteristics = publicIfoData[poolId]
  const userPoolCharacteristics = walletIfoData[poolId]
  const isPendingTx = userPoolCharacteristics?.isPendingTx
  const amountTokenCommittedInLP = userPoolCharacteristics?.amountTokenCommittedInLP
  const limitPerUserInLP = publicPoolCharacteristics?.limitPerUserInLP
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const currentBlock = useCurrentBlock()
  const { balance: userCurrencyBalance } = useTokenBalanceByChain(ifo.currency.address, ifo.chainId)
  const currencyImageUrl = useMemo(
    () => getTokenListTokenUrl(ifo.currency) || getTokenLogoURLByAddress(ifo.currency.address, ifo.currency.chainId),
    [ifo.currency],
  )

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
      creditLeft={walletIfoData.ifoCredit?.creditLeft || new BigNumber(0)}
      ifo={ifo}
      publicIfoData={publicIfoData}
      walletIfoData={walletIfoData}
      onSuccess={handleContributeSuccess}
      userCurrencyBalance={userCurrencyBalance}
    />,
    false,
  )

  const [onPresentGetTokenModal] = useModal(
    <IfoGetTokenModal symbol={ifo.currency.symbol} address={ifo.currency.address} imageSrc={currencyImageUrl || ''} />,
    false,
  )

  const noNeedCredit = useMemo(() => ifo.version >= 3.1 && poolId === PoolIds.poolBasic, [ifo.version, poolId])

  const isMaxCommitted = useMemo(
    () =>
      (!noNeedCredit &&
        walletIfoData.ifoCredit?.creditLeft &&
        walletIfoData.ifoCredit?.creditLeft.isLessThanOrEqualTo(0)) ||
      (limitPerUserInLP?.isGreaterThan(0) && amountTokenCommittedInLP?.isGreaterThanOrEqualTo(limitPerUserInLP)),
    [amountTokenCommittedInLP, limitPerUserInLP, noNeedCredit, walletIfoData.ifoCredit?.creditLeft],
  )

  const isDisabled = useMemo(
    () => disabled || isPendingTx || isMaxCommitted || publicIfoData.status !== 'live',
    [disabled, isPendingTx, isMaxCommitted, publicIfoData.status],
  )

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
