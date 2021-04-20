import React from 'react'
import { Flex, Box, Text } from '@pancakeswap-libs/uikit'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import useI18n from 'hooks/useI18n'
import { Token } from 'config/constants/types'
import ApprovalAction from './ApprovalAction'
import StakeAction from './StakeAction'

interface StakingActionsProps {
  stakingToken: Token
  stakedBalance: BigNumber
  earningTokenSymbol: string
  needsApproval: boolean
  isOldSyrup: boolean
  isFinished: boolean
  sousId: number
}

const InlineText = styled(Text)`
  display: inline;
`

const StakingActions: React.FC<StakingActionsProps> = ({
  stakingToken,
  stakedBalance,
  earningTokenSymbol,
  needsApproval,
  isOldSyrup,
  isFinished,
  sousId,
}) => {
  const TranslateString = useI18n()

  return (
    <Flex flexDirection="column">
      <Box display="inline">
        <InlineText color="textSubtle" textTransform="uppercase" bold fontSize="12px">
          {TranslateString(1070, `stake`)}
        </InlineText>
        <InlineText color="secondary" textTransform="uppercase" bold fontSize="12px">
          {` ${stakingToken.symbol}`}
        </InlineText>
      </Box>
      {needsApproval && !isOldSyrup ? (
        <ApprovalAction
          stakingToken={stakingToken}
          earningTokenSymbol={earningTokenSymbol}
          isFinished={isFinished}
          sousId={sousId}
        />
      ) : (
        <StakeAction stakedBalance={stakedBalance} />
      )}
    </Flex>
  )
}

export default StakingActions
