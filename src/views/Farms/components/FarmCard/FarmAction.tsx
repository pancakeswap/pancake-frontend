import React, { useMemo, useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Contract } from 'web3-eth-contract'
import { provider } from 'web3-core'
import { getContract } from 'utils/erc20'
import { Button, Flex, Heading, Text, IconButton, AddIcon, useModal } from '@pancakeswap-libs/uikit'
import { Farm } from 'state/types'
import { useFarmFromSymbol, useFarmUser } from 'state/hooks'
import useI18n from 'hooks/useI18n'
import UnlockButton from 'components/UnlockButton'
import { useApprove } from 'hooks/useApprove'
import useStake from 'hooks/useStake'
import useUnstake from 'hooks/useUnstake'
import { getBalanceNumber } from 'utils/formatBalance'
import DepositModal from '../../../Farm/components/DepositModal'
import WithdrawModal from '../../../Farm/components/WithdrawModal'

interface FarmCardActionsProps {
  isStaking?: boolean
  stakedBalance?: BigNumber
  tokenBalance?: BigNumber
  tokenName?: string
  pid?: number
}

const FarmAction: React.FC<FarmCardActionsProps> = ({ stakedBalance, tokenBalance, isStaking, tokenName, pid }) => {
  const TranslateString = useI18n()
  const { onStake } = useStake(pid)
  const { onUnstake } = useUnstake(pid)

  const displayBalance = getBalanceNumber(stakedBalance)

  const [onPresentDeposit] = useModal(<DepositModal max={tokenBalance} onConfirm={onStake} tokenName={tokenName} />)
  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalance} onConfirm={onUnstake} tokenName={tokenName} />,
  )

  const renderStakingButtons = () => {
    return displayBalance === 0 ? (
      <Button onClick={onPresentDeposit}>Stake LP</Button>
    ) : (
      <>
        <IconButton onClick={onPresentWithdraw}>
          {/* This should be changed to SubtractIcon once uikit updated */}
          <AddIcon color="background" />
        </IconButton>
        <IconButton onClick={onPresentDeposit}>
          <AddIcon color="background" />
        </IconButton>
      </>
    )
  }

  const renderHarvestButtons = () => {
    return <Button disabled={stakedBalance.eq(new BigNumber(0))}>Harvest</Button>
  }

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Heading color={displayBalance === 0 ? 'textDisabled' : 'text'}>{displayBalance}</Heading>
      {isStaking ? renderStakingButtons() : renderHarvestButtons()}
    </Flex>
  )
}

export default FarmAction
