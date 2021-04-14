import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Box, ChevronDownIcon, ChevronUpIcon, Flex, IconButton, Text } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import { useAppDispatch } from 'state'
import { markBetAsCollected } from 'state/predictions'
import { Bet, BetPosition } from 'state/types'
import useI18n from 'hooks/useI18n'
import { formatBnb, getPayout } from '../../helpers'
import useIsRoundCanceled from '../../hooks/useIsRoundCanceled'
import CollectWinningsButton from '../CollectWinningsButton'
import ReclaimPositionButton from '../ReclaimPositionButton'
import BetDetails from './BetDetails'
import { Result } from './BetResult'

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
  const { account } = useWeb3React()
  const payout = getPayout(bet)
  const dispatch = useAppDispatch()
  const isRoundCanceled = useIsRoundCanceled(round)

  const roundResultPosition = round.closePrice > round.lockPrice ? BetPosition.BULL : BetPosition.BEAR

  const toggleOpen = () => setIsOpen(!isOpen)

  const getRoundResult = () => {
    if (isRoundCanceled) {
      return Result.CANCELED
    }

    return position === roundResultPosition ? Result.WIN : Result.LOSE
  }

  const getRoundColor = (result) => {
    switch (result) {
      case Result.WIN:
        return 'success'
      case Result.LOSE:
        return 'failure'
      case Result.CANCELED:
        return 'textDisabled'
      default:
        return 'text'
    }
  }

  const getRoundPrefix = (result) => {
    if (result === Result.LOSE) {
      return '-'
    }

    if (result === Result.WIN) {
      return '+'
    }

    return ''
  }

  const handleSuccess = async () => {
    dispatch(markBetAsCollected({ account, betId: bet.id }))
  }

  const roundResult = getRoundResult()
  const resultTextColor = getRoundColor(roundResult)
  const resultTextPrefix = getRoundPrefix(roundResult)

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
            {roundResult === Result.CANCELED
              ? TranslateString(999, 'Cancelled')
              : `${resultTextPrefix}${formatBnb(amount)}`}
          </Text>
        </YourResult>
        {roundResult === Result.WIN && !claimed && (
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
        {roundResult === Result.CANCELED && !claimed && (
          <ReclaimPositionButton onSuccess={handleSuccess} epoch={bet.round.epoch} scale="sm" mr="8px">
            {TranslateString(999, 'Reclaim')}
          </ReclaimPositionButton>
        )}
        <IconButton variant="text" scale="sm" onClick={toggleOpen}>
          {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </IconButton>
      </StyledBet>
      {isOpen && <BetDetails bet={bet} result={getRoundResult()} />}
    </>
  )
}

export default HistoricalBet
