import { Ifo, isCrossChainIfoSupportedOnly, PoolIds } from '@pancakeswap/ifos'
import { useTranslation } from '@pancakeswap/localization'
import { Button, IfoGetTokenModal, useModal, useToast } from '@pancakeswap/uikit'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { getTokenListTokenUrl, getTokenLogoURLByAddress } from '@pancakeswap/widgets-internal'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useTokenBalanceByChain } from 'hooks/useTokenBalance'
import { useCallback, useMemo } from 'react'
import { useCurrentBlock } from 'state/block/hooks'
import { PublicIfoData, WalletIfoData } from 'views/Ifos/types'

import { useUserVeCakeStatus } from 'components/CrossChainVeCakeModal/hooks/useUserVeCakeStatus'
import { logGTMIfoCommitEvent } from 'utils/customGTMEventTracking'
import ContributeModal from './ContributeModal'

interface Props {
  poolId: PoolIds
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
}
const ContributeButton: React.FC<React.PropsWithChildren<Props>> = ({ poolId, ifo, publicIfoData, walletIfoData }) => {
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
  const { isProfileSynced } = useUserVeCakeStatus(ifo.chainId)
  const isCrossChainIfo = useMemo(() => isCrossChainIfoSupportedOnly(ifo.chainId), [ifo.chainId])

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

  const presentContributeModal = useCallback(() => {
    onPresentContributeModal()
    logGTMIfoCommitEvent(poolId)
  }, [onPresentContributeModal, poolId])

  const noNeedCredit = useMemo(() => ifo.version >= 3.1 && poolId === PoolIds.poolBasic, [ifo.version, poolId])

  const isMaxCommitted = useMemo(
    () =>
      (!noNeedCredit &&
        walletIfoData.ifoCredit?.creditLeft &&
        walletIfoData.ifoCredit?.creditLeft.isLessThanOrEqualTo(0)) ||
      (limitPerUserInLP?.isGreaterThan(0) && amountTokenCommittedInLP?.isGreaterThanOrEqualTo(limitPerUserInLP)),
    [amountTokenCommittedInLP, limitPerUserInLP, noNeedCredit, walletIfoData.ifoCredit?.creditLeft],
  )

  // In a Cross-Chain Public Sale (poolUnlimited),
  // the user needs to have credit (iCAKE) available to participate and an active profile
  const isCrossChainAndNoProfileOrCredit = useMemo(
    () =>
      poolId === PoolIds.poolUnlimited &&
      isCrossChainIfo &&
      (walletIfoData.ifoCredit?.credit.eq(0) || !isProfileSynced),
    [isCrossChainIfo, isProfileSynced, poolId, walletIfoData.ifoCredit?.credit],
  )

  const isDisabled = useMemo(
    () => isPendingTx || isMaxCommitted || publicIfoData.status !== 'live' || isCrossChainAndNoProfileOrCredit,
    [isPendingTx, isMaxCommitted, publicIfoData.status, isCrossChainAndNoProfileOrCredit],
  )

  return (
    <Button
      onClick={userCurrencyBalance.isEqualTo(0) ? onPresentGetTokenModal : presentContributeModal}
      width="100%"
      disabled={isDisabled}
    >
      {isMaxCommitted && publicIfoData.status === 'live' ? t('Max. Committed') : t('Commit CAKE')}
    </Button>
  )
}

export default ContributeButton
