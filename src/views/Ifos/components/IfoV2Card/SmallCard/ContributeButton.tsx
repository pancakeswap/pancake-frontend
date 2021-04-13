import React from 'react'
import BigNumber from 'bignumber.js'
import { Contract } from 'web3-eth-contract'
import { Button, useModal } from '@pancakeswap-libs/uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import { Token } from 'config/constants/types'
import useI18n from 'hooks/useI18n'
import useTokenBalance from 'hooks/useTokenBalance'
import { getAddress } from 'utils/addressHelpers'
import { PoolIds } from 'hooks/ifo/v2/types'
import { useToast } from 'state/hooks'
import ContributeModal from './ContributeModal'
import GetLpModal from './GetLpModal'

interface Props {
  poolId: PoolIds
  currency: Token
  contract: Contract
  limitContributionPerUser: BigNumber
  userContribution: BigNumber
  isPendingTx: boolean
  addUserContributedAmount: (amount: BigNumber) => void
}
const ContributeButton: React.FC<Props> = ({
  currency,
  poolId,
  contract,
  limitContributionPerUser,
  userContribution,
  isPendingTx,
  addUserContributedAmount,
}) => {
  const TranslateString = useI18n()
  const { toastSuccess } = useToast()
  const userCurrencyBalance = useTokenBalance(getAddress(currency.address))

  const handleContributeSuccess = (amount: BigNumber) => {
    toastSuccess('Success!', `You have contributed ${getBalanceNumber(amount)} CAKE-BNB LP tokens to this IFO!`)
    addUserContributedAmount(amount)
  }

  const [onPresentContributeModal] = useModal(
    <ContributeModal
      poolId={poolId}
      currency={currency}
      contract={contract}
      onSuccess={handleContributeSuccess}
      limitContributionPerUser={limitContributionPerUser}
      userContribution={userContribution}
      userCurrencyBalance={userCurrencyBalance}
    />,
    false,
  )

  const [onPresentGetLpModal] = useModal(<GetLpModal currency={currency} />, false)

  const isDisabled =
    isPendingTx ||
    (limitContributionPerUser.isGreaterThan(0) && userContribution.isGreaterThanOrEqualTo(limitContributionPerUser))

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
