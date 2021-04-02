import React, { useState } from 'react'
import { Box, Button, ChevronDownIcon, ChevronUpIcon, Flex, IconButton, Text, useModal } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import { Bet, BetPosition } from 'state/types'
import useI18n from 'hooks/useI18n'
import { formatBnb } from '../../helpers'
import CollectRoundWinningsModal from '../CollectRoundWinningsModal'

interface BetProps {
  bet: Bet
}

const StyledBet = styled(Flex).attrs({ alignItems: 'center', p: '16px' })`
  background-color: ${({ theme }) => theme.card.background};
  border-bottom: 2px solid ${({ theme }) => theme.colors.borderColor};
`

const YourResult = styled(Box)`
  flex: 1;
`

const HistoricalBet: React.FC<BetProps> = ({ bet }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { amount, claimed, position, round } = bet

  const TranslateString = useI18n()
  const [onPresentCollectWinningsModal] = useModal(
    <CollectRoundWinningsModal bnbToCollect={bet.amount} epoch={round.epoch} roundId={round.id} />,
    false,
  )
  const roundResultPosition = round.closePrice > round.lockPrice ? BetPosition.BULL : BetPosition.BEAR
  const isWinner = position === roundResultPosition
  const resultTextColor = isWinner ? 'success' : 'failure'
  const resultTextPrefix = isWinner ? '' : '-'
  const toggleOpen = () => setIsOpen(!isOpen)

  return (
    <StyledBet>
      <Text textAlign="center">
        <Text fontSize="12px" color="textSubtle">
          {TranslateString(999, 'Round')}
        </Text>
        <Text bold lineHeight={1}>
          {round.epoch.toLocaleString()}
        </Text>
      </Text>
      <YourResult px="24px">
        <Text fontSize="12px" color="textSubtle">
          {TranslateString(999, 'Your Result')}
        </Text>
        <Text bold color={resultTextColor} lineHeight={1}>
          {`${resultTextPrefix}${formatBnb(amount)}`}
        </Text>
      </YourResult>
      {isWinner && !claimed && (
        <Button scale="sm" mr="8px" onClick={onPresentCollectWinningsModal}>
          {TranslateString(999, 'Collect')}
        </Button>
      )}
      <IconButton variant="text" scale="sm" onClick={toggleOpen}>
        {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </IconButton>
    </StyledBet>
  )
}

export default HistoricalBet
