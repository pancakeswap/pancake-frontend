import React from 'react'
import BigNumber from 'bignumber.js'
import { Contract } from 'web3-eth-contract'
import { Button, useModal } from '@pancakeswap-libs/uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import { getAddress } from 'utils/addressHelpers'
import { Ifo } from 'config/constants/types'
import useI18n from 'hooks/useI18n'
import { PoolIds } from 'hooks/ifo/v2/types'
import { useToast } from 'state/hooks'
import ContributeModal from './ContributeModal'

interface Props {
  poolId: PoolIds
  ifo: Ifo
  contract: Contract
  isPendingTx: boolean
  addUserContributedAmount: (amount: BigNumber) => void
}
const ContributeButton: React.FC<Props> = ({ ifo, poolId, contract, isPendingTx, addUserContributedAmount }) => {
  const { currency } = ifo
  const TranslateString = useI18n()
  const { toastSuccess } = useToast()

  const handleContributeSuccess = (amount: BigNumber) => {
    toastSuccess('Success!', `You have contributed ${getBalanceNumber(amount)} CAKE-BNB LP tokens to this IFO!`)
    addUserContributedAmount(amount)
  }

  const [onPresentContributeModal] = useModal(
    <ContributeModal
      poolId={poolId}
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

export default ContributeButton
