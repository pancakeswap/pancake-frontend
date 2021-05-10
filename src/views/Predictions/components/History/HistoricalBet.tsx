import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Box, ChevronDownIcon, ChevronUpIcon, Flex, IconButton, PlayCircleOutlineIcon, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useAppDispatch } from 'state'
import { markBetAsCollected } from 'state/predictions'
import { Bet, BetPosition, PredictionStatus } from 'state/types'
import { useGetCurrentEpoch, useGetPredictionsStatus } from 'state/hooks'
import { useTranslation } from 'contexts/Localization'
import { formatBnb, getPayout } from '../../helpers'
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
  cursor: pointer;
`

const YourResult = styled(Box)`
  flex: 1;
`

const HistoricalBet: React.FC<BetProps> = ({ bet }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { amount, claimed, position, round } = bet

  const { t } = useTranslation()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const currentEpoch = useGetCurrentEpoch()
  const status = useGetPredictionsStatus()
  const roundResultPosition = round.closePrice > round.lockPrice ? BetPosition.BULL : BetPosition.BEAR

  const toggleOpen = () => setIsOpen(!isOpen)

  const getRoundResult = () => {
    if (round.failed) {
      return Result.CANCELED
    }

    if (round.epoch >= currentEpoch - 1) {
      return Result.LIVE
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
  const isOpenRound = round.epoch === currentEpoch
  const isLiveRound = status === PredictionStatus.LIVE && round.epoch === currentEpoch - 1

  // Winners get the payout, otherwise the claim what they put it if it was canceled
  const payout = roundResult === Result.WIN ? getPayout(bet) : amount

  const renderBetLabel = () => {
    if (isOpenRound) {
      return (
        <Flex alignItems="center">
          <PlayCircleOutlineIcon color="primary" mr="6px" width="24px" />
          <Text color="primary" bold>
            {t('Starting Soon')}
          </Text>
        </Flex>
      )
    }

    if (isLiveRound) {
      return (
        <Flex alignItems="center">
          <PlayCircleOutlineIcon color="secondary" mr="6px" width="24px" />
          <Text color="secondary" bold>
            {t('Live Now')}
          </Text>
        </Flex>
      )
    }

    return (
      <>
        <Text fontSize="12px" color="textSubtle">
          {t('Your Result')}
        </Text>
        <Text bold color={resultTextColor} lineHeight={1}>
          {roundResult === Result.CANCELED ? t('Canceled') : `${resultTextPrefix}${formatBnb(payout)}`}
        </Text>
      </>
    )
  }

  return (
    <>
      <StyledBet onClick={toggleOpen} role="button">
        <Box width="48px">
          <Text textAlign="center">
            <Text fontSize="12px" color="textSubtle">
              {t('Round')}
            </Text>
            <Text bold lineHeight={1}>
              {round.epoch.toLocaleString()}
            </Text>
          </Text>
        </Box>
        <YourResult px="24px">{renderBetLabel()}</YourResult>
        {roundResult === Result.WIN && !claimed && (
          <CollectWinningsButton
            onSuccess={handleSuccess}
            hasClaimed={bet.claimed}
            epoch={bet.round.epoch}
            payout={payout}
            scale="sm"
            mr="8px"
          >
            {t('Collect')}
          </CollectWinningsButton>
        )}
        {roundResult === Result.CANCELED && !claimed && (
          <ReclaimPositionButton onSuccess={handleSuccess} epoch={bet.round.epoch} scale="sm" mr="8px">
            {t('Reclaim')}
          </ReclaimPositionButton>
        )}
        {!isOpenRound && !isLiveRound && (
          <IconButton variant="text" scale="sm">
            {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </IconButton>
        )}
      </StyledBet>
      {isOpen && <BetDetails bet={bet} result={getRoundResult()} />}
    </>
  )
}

export default HistoricalBet
