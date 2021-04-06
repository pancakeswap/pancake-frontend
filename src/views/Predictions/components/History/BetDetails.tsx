import React from 'react'
import styled from 'styled-components'
import { Bet } from 'state/types'
import useI18n from 'hooks/useI18n'
import { Flex, Text, Link, Heading } from '@pancakeswap-libs/uikit'
import { RoundResult } from '../RoundResult'
import BetResult from './BetResult'

interface BetDetailsProps {
  bet: Bet
  isWinner: boolean
}

const StyledBetDetails = styled.div`
  background-color: ${({ theme }) => theme.colors.dropdown};
  border-bottom: 2px solid ${({ theme }) => theme.colors.borderColor};
  padding: 24px;
`

const BetDetails: React.FC<BetDetailsProps> = ({ bet, isWinner }) => {
  const TranslateString = useI18n()

  return (
    <StyledBetDetails>
      <BetResult bet={bet} isWinner={isWinner} />
      <Heading mb="8px">{TranslateString(999, 'Round History')}</Heading>
      <RoundResult round={bet.round} mb="24px" />
      <Flex alignItems="center" justifyContent="space-between" mb="8px">
        <Text>{TranslateString(999, 'Opening Block')}</Text>
        <Link href={`https://bscscan.com/block/${bet.round.startBlock}`} external>
          {bet.round.startBlock}
        </Link>
      </Flex>
      <Flex alignItems="center" justifyContent="space-between">
        <Text>{TranslateString(999, 'Closing Block')}</Text>
        <Link href={`https://bscscan.com/block/${bet.round.endBlock}`} external>
          {bet.round.endBlock}
        </Link>
      </Flex>
    </StyledBetDetails>
  )
}

export default BetDetails
