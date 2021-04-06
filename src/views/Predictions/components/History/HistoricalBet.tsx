import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Box, ChevronDownIcon, ChevronUpIcon, Flex, IconButton, Text } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import { updateBet } from 'state/predictions'
import { Bet, BetPosition } from 'state/types'
import useI18n from 'hooks/useI18n'
import { formatBnb, getPayout } from '../../helpers'
import CollectWinningsButton from '../CollectWinningsButton'
import BetDetails from './BetDetails'

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
  const roundResultPosition = round.closePrice > round.lockPrice ? BetPosition.BULL : BetPosition.BEAR
  const isWinner = position === roundResultPosition
  const resultTextColor = isWinner ? 'success' : 'failure'
  const resultTextPrefix = isWinner ? '' : '-'
  const toggleOpen = () => setIsOpen(!isOpen)
  const payout = getPayout(bet)
  const dispatch = useDispatch()

  const handleSuccess = async () => {
    await dispatch(updateBet({ id: bet.id }))
  }

  return (
    <>
      <StyledBet>
        <Box width="48px">
          <Text textAlign="center">
            <Text fontSize="12px" color="textSubtle">
              {TranslateString(999, 'Round')}
            </Text>
            <Text bold lineHeight={1}>
              {round.epoch.toLocaleString()}
            </Text>
          </Text>
        </Box>
        <YourResult px="24px">
          <Text fontSize="12px" color="textSubtle">
            {TranslateString(999, 'Your Result')}
          </Text>
          <Text bold color={resultTextColor} lineHeight={1}>
            {`${resultTextPrefix}${formatBnb(amount)}`}
          </Text>
        </YourResult>
        {isWinner && !claimed && (
          <CollectWinningsButton
            onSuccess={handleSuccess}
            hasClaimed={bet.claimed}
            epoch={bet.round.epoch}
            payout={payout}
            scale="sm"
            mr="8px"
          >
            {TranslateString(999, 'Collect')}
          </CollectWinningsButton>
        )}
        <IconButton variant="text" scale="sm" onClick={toggleOpen}>
          {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </IconButton>
      </StyledBet>
      {isOpen && <BetDetails bet={bet} isWinner={isWinner} />}
    </>
  )
}

export default HistoricalBet
