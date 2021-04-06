import React from 'react'
import { Box, Flex, Heading, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import styled from 'styled-components'
import { Bet, BetPosition } from 'state/types'
import { formatBnb } from '../../helpers'
import CollectWinningsButton from '../CollectWinningsButton'
import PositionTag from '../PositionTag'

interface BetResultProps {
  bet: Bet
  isWinner: boolean
}

const StyledBetResult = styled(Box)`
  border: 2px solid ${({ theme }) => theme.colors.textDisabled};
  border-radius: 16px;
  margin-bottom: 24px;
  padding: 16px;
`

const BetResult: React.FC<BetResultProps> = ({ bet, isWinner }) => {
  const TranslateString = useI18n()

  return (
    <>
      <Heading mb="8px">{TranslateString(999, 'Your History')}</Heading>
      <StyledBetResult>
        {isWinner && !bet.claimed && (
          <CollectWinningsButton bet={bet} width="100%" mb="16px">
            {TranslateString(999, 'Collect Winnings')}
          </CollectWinningsButton>
        )}
        <Flex alignItems="center" justifyContent="space-between" mb="16px">
          <Text>{TranslateString(999, 'Your direction')}</Text>
          <PositionTag betPosition={bet.position}>
            {bet.position === BetPosition.BULL ? TranslateString(999, 'Up') : TranslateString(999, 'Down')}
          </PositionTag>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between" mb="16px">
          <Text>{TranslateString(999, 'Your position')}</Text>
          <Text>{`${formatBnb(bet.amount)} BNB`}</Text>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between">
          <Text bold>{TranslateString(999, 'Your Result')}</Text>
          <Text bold>{`${formatBnb(bet.amount)} BNB`}</Text>
        </Flex>
      </StyledBetResult>
    </>
  )
}

export default BetResult
