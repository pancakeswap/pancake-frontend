import React from 'react'
import BigNumber from 'bignumber.js'
import { Button, useModal } from '@pancakeswap-libs/uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import { Ifo, PoolIds } from 'config/constants/types'
import { WalletIfoData, PublicIfoData } from 'hooks/ifo/types'
import useI18n from 'hooks/useI18n'
import useTokenBalance from 'hooks/useTokenBalance'
import { getAddress } from 'utils/addressHelpers'
import useToast from 'hooks/useToast'
import ContributeModal from './ContributeModal'
import GetLpModal from './GetLpModal'

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
  const TranslateString = useI18n()
  const { toastSuccess } = useToast()
  const userCurrencyBalance = useTokenBalance(getAddress(ifo.currency.address))

  // Refetch all the data, and display a message when fetching is done
  const handleContributeSuccess = async (amount: BigNumber) => {
    await Promise.all([publicIfoData.fetchIfoData(), walletIfoData.fetchIfoData()])
    toastSuccess('Success!', `You have contributed ${getBalanceNumber(amount)} CAKE-BNB LP tokens to this IFO!`)
  }

  const [onPresentContributeModal] = useModal(
    <ContributeModal
      poolId={poolId}
      ifo={ifo}
      publicIfoData={publicIfoData}
      walletIfoData={walletIfoData}
      onSuccess={handleContributeSuccess}
      userCurrencyBalance={userCurrencyBalance}
    />,
    false,
  )

  const [onPresentGetLpModal] = useModal(<GetLpModal currency={ifo.currency} />, false)

  const isDisabled =
    isPendingTx ||
    (limitPerUserInLP.isGreaterThan(0) && amountTokenCommittedInLP.isGreaterThanOrEqualTo(limitPerUserInLP))

  return (
    <Button
      onClick={userCurrencyBalance.isEqualTo(0) ? onPresentGetLpModal : onPresentContributeModal}
      width="100%"
      disabled={isDisabled}
    >
      {isDisabled ? TranslateString(999, 'Max. Committed') : TranslateString(999, 'Commit LP Tokens')}
    </Button>
  )
}

export default ContributeButton
