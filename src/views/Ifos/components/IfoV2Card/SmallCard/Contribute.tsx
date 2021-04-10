import React from 'react'
import BigNumber from 'bignumber.js'
import { Contract } from 'web3-eth-contract'
import { Button, useModal } from '@pancakeswap-libs/uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import { getAddress } from 'utils/addressHelpers'
import { Ifo } from 'config/constants/types'
import useI18n from 'hooks/useI18n'
import { UserPoolCharacteristics } from 'hooks/ifo/v2/types'
import { useToast } from 'state/hooks'
import ContributeModal from './ContributeModal'

interface ContributeProps {
  ifo: Ifo
  contract: Contract
  userPoolCharacteristics: UserPoolCharacteristics
  addUserContributedAmount: (amount: BigNumber) => void
}
const Contribute: React.FC<ContributeProps> = ({
  ifo,
  contract,
  userPoolCharacteristics,
  addUserContributedAmount,
}) => {
  const { currency } = ifo
  const { isPendingTx } = userPoolCharacteristics
  const TranslateString = useI18n()
  const { toastSuccess } = useToast()

  const handleContributeSuccess = (amount: BigNumber) => {
    toastSuccess('Success!', `You have contributed ${getBalanceNumber(amount)} CAKE-BNB LP tokens to this IFO!`)
    addUserContributedAmount(amount)
  }

  const [onPresentContributeModal] = useModal(
    <ContributeModal
      currency={currency.symbol}
      contract={contract}
      currencyAddress={getAddress(currency.address)}
      onSuccess={handleContributeSuccess}
    />,
    false,
  )

  return (
    <Button onClick={onPresentContributeModal} width="100%" disabled={isPendingTx}>
      {TranslateString(999, 'Contribute')}
    </Button>
  )
}

export default Contribute
