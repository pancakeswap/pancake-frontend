import React from 'react'
import BigNumber from 'bignumber.js'
import { Contract } from 'web3-eth-contract'
import { Box, Button, Flex, Text, useModal } from '@pancakeswap-libs/uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import { Ifo } from 'config/constants/types'
import useI18n from 'hooks/useI18n'
import { useToast } from 'state/hooks'
import { UserInfo } from '../../hooks/useGetWalletIfoData'
import { PublicIfoState } from '../../hooks/useGetPublicIfoData'
import ContributeModal from './ContributeModal'
import PercentageOfTotal from './PercentageOfTotal'

interface ContributeProps {
  ifo: Ifo
  contract: Contract
  userInfo: UserInfo
  isPendingTx: boolean
  publicIfoData: PublicIfoState
  addUserContributedAmount: (amount: BigNumber) => void
}
const Contribute: React.FC<ContributeProps> = ({
  ifo,
  contract,
  userInfo,
  isPendingTx,
  publicIfoData,
  addUserContributedAmount,
}) => {
  const { currency, currencyAddress } = ifo
  const { totalAmount } = publicIfoData
  const TranslateString = useI18n()
  const contributedBalance = getBalanceNumber(userInfo.amount)
  const { toastSuccess } = useToast()

  const handleContributeSuccess = (amount: BigNumber) => {
    toastSuccess('Success!', `You have contributed ${getBalanceNumber(amount)} CAKE-BNB LP tokens to this IFO!`)
    addUserContributedAmount(amount)
  }

  const [onPresentContributeModal] = useModal(
    <ContributeModal
      currency={currency}
      contract={contract}
      currencyAddress={currencyAddress}
      onSuccess={handleContributeSuccess}
    />,
    false,
  )

  return (
    <Box>
      <Flex mb="4px">
        <Text as="span" bold fontSize="12px" mr="4px" textTransform="uppercase">
          CAKE-BNB LP
        </Text>
        <Text as="span" color="textSubtle" fontSize="12px" textTransform="uppercase" bold>
          Committed
        </Text>
      </Flex>
      <Flex alignItems="center">
        <Box style={{ flex: 1 }} pr="8px">
          <Text bold fontSize="20px">
            {contributedBalance.toFixed(4)}
          </Text>
        </Box>
        <Button onClick={onPresentContributeModal} disabled={isPendingTx}>
          {TranslateString(999, 'Contribute')}
        </Button>
      </Flex>
      <PercentageOfTotal userAmount={userInfo.amount} totalAmount={totalAmount} />
    </Box>
  )
}

export default Contribute
