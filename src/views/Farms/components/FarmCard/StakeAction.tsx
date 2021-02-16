import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Button, Flex, Heading, IconButton, AddIcon, MinusIcon, useModal } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import useStake from 'hooks/useStake'
import useUnstake from 'hooks/useUnstake'
import { getBalanceNumber } from 'utils/formatBalance'
import DepositModal from '../DepositModal'
import WithdrawModal from '../WithdrawModal'

interface FarmCardActionsProps {
  stakedBalance?: BigNumber
  tokenBalance?: BigNumber
  tokenName?: string
  pid?: number
  addLiquidityUrl?: string
}

const StyledHeading = styled(Heading)`
  margin-right: 48px;
`

const StakingButtonContainer = styled.div`
  margin-left: auto;
`
const IconButtonWrapper = styled.div`
  display: flex;

  button {
    width: 32px;
    height: 32px;

    svg {
      width: 20px;
    }
  }
`

const StyledButton = styled(Button)`
  white-space: nowrap;
  color: white;
  height: 32px;
  width: 160px;
  border-radius: 16px;
  padding-left: 0;
  padding-right: 0;
`

const StakeAction: React.FC<FarmCardActionsProps> = ({
  stakedBalance,
  tokenBalance,
  tokenName,
  pid,
  addLiquidityUrl,
}) => {
  const TranslateString = useI18n()
  const { onStake } = useStake(pid)
  const { onUnstake } = useUnstake(pid)

  const rawStakedBalance = getBalanceNumber(stakedBalance)
  const displayBalance = rawStakedBalance.toLocaleString()

  const [onPresentDeposit] = useModal(
    <DepositModal max={tokenBalance} onConfirm={onStake} tokenName={tokenName} addLiquidityUrl={addLiquidityUrl} />,
  )
  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalance} onConfirm={onUnstake} tokenName={tokenName} />,
  )

  const renderStakingButtons = () => {
    return rawStakedBalance === 0 ? (
      <StyledButton onClick={onPresentDeposit}>{TranslateString(999, 'Stake LP')}</StyledButton>
    ) : (
      <IconButtonWrapper>
        <IconButton variant="tertiary" onClick={onPresentWithdraw} mr="6px">
          <MinusIcon color="primary" />
        </IconButton>
        <IconButton variant="tertiary" onClick={onPresentDeposit}>
          <AddIcon color="primary" />
        </IconButton>
      </IconButtonWrapper>
    )
  }

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <StyledHeading color={rawStakedBalance === 0 ? 'textDisabled' : 'text'}>{displayBalance}</StyledHeading>
      <StakingButtonContainer>{renderStakingButtons()}</StakingButtonContainer>
    </Flex>
  )
}

export default StakeAction
