import React, { useState, useCallback } from 'react'
import { Flex, Box, Text, Button, AutoRenewIcon, useModal } from '@pancakeswap-libs/uikit'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Token } from 'config/constants/types'
import { useSousStake } from 'hooks/useStake'
import { useSousApprove } from 'hooks/useApprove'
import useI18n from 'hooks/useI18n'
import { useERC20 } from 'hooks/useContract'
import { useToast } from 'state/hooks'
import { getAddress } from 'utils/addressHelpers'
import DepositModal from '../DepositModal'
import StakeModal from '../StakeModal'

import ApprovalAction from './ApprovalAction'

interface StakeActionsProps {
  stakingTokenBalance: BigNumber
  stakingToken: Token
  earningToken: Token
  stakedBalance: BigNumber
  stakingLimit?: number
  sousId: number
  isBnbPool: boolean
}

const InlineText = styled(Text)`
  display: inline;
`

const StakeAction: React.FC<StakeActionsProps> = ({
  stakingTokenBalance,
  stakingToken,
  earningToken,
  stakedBalance,
  stakingLimit,
  sousId,
  isBnbPool,
}) => {
  const TranslateString = useI18n()
  const { onStake } = useSousStake(sousId, isBnbPool)
  const convertedLimit = new BigNumber(stakingLimit).multipliedBy(new BigNumber(10).pow(earningToken.decimals))

  const [onPresentDeposit] = useModal(
    <DepositModal
      max={stakingLimit && stakingTokenBalance.isGreaterThan(convertedLimit) ? convertedLimit : stakingTokenBalance}
      onConfirm={onStake}
      tokenName={stakingLimit ? `${stakingToken.symbol} (${stakingLimit} max)` : stakingToken.symbol}
      stakingTokenDecimals={stakingToken.decimals}
    />,
  )

  const [onPresentStake] = useModal(
    <StakeModal
      stakingMax={
        stakingLimit && stakingTokenBalance.isGreaterThan(convertedLimit) ? convertedLimit : stakingTokenBalance
      }
      isBnbPool={isBnbPool}
      sousId={sousId}
      stakingToken={stakingToken}
    />,
  )

  return (
    <Flex flexDirection="column">
      {stakedBalance.toNumber() === 0 ? (
        <Button onClick={onPresentStake}>{TranslateString(1070, 'Stake')}</Button>
      ) : (
        <Button>Stuff is staked</Button>
      )}
    </Flex>
  )
}

export default StakeAction
