import React from 'react'
import styled from 'styled-components'
import { BlockIcon, CardBody } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { Round, BetPosition } from 'state/types'
import { RoundResult } from '../RoundResult'
import MultiplierArrow from './MultiplierArrow'
import Card from './Card'
import CardHeader from './CardHeader'
import CollectWinningsOverlay from './CollectWinningsOverlay'
import CanceledRoundCard from './CanceledRoundCard'

interface ExpiredRoundCardProps {
  round: Round
  betAmount?: number
  hasEnteredUp: boolean
  hasEnteredDown: boolean
  bullMultiplier: number
  bearMultiplier: number
}

const StyledExpiredRoundCard = styled(Card)`
  opacity: 0.7;
  transition: opacity 300ms;

  &:hover {
    opacity: 1;
  }
`

const ExpiredRoundCard: React.FC<ExpiredRoundCardProps> = ({
  round,
  betAmount,
  hasEnteredUp,
  hasEnteredDown,
  bullMultiplier,
  bearMultiplier,
}) => {
  const { t } = useTranslation()
  const { id, endBlock, lockPrice, closePrice, bearAmount, bullAmount } = round
  const betPosition = closePrice > lockPrice ? BetPosition.BULL : BetPosition.BEAR
  const hasEntered = hasEnteredUp || hasEnteredDown

  if (round.failed) {
    return <CanceledRoundCard round={round} />
  }

  return (
    <StyledExpiredRoundCard>
      <CardHeader
        status="expired"
        icon={<BlockIcon mr="4px" width="21px" color="textDisabled" />}
        title={t('Expired')}
        blockNumber={endBlock}
        epoch={round.epoch}
      />
      <CardBody p="16px" style={{ position: 'relative' }}>
        <CollectWinningsOverlay roundId={id} hasEntered={hasEntered} isBottom={hasEnteredDown} />
        <MultiplierArrow
          totalAmount={bullAmount}
          betAmount={betAmount}
          multiplier={bullMultiplier}
          isActive={betPosition === BetPosition.BULL}
          hasEntered={hasEnteredUp}
        />
        <RoundResult round={round} />
        <MultiplierArrow
          totalAmount={bearAmount}
          betAmount={betAmount}
          multiplier={bearMultiplier}
          betPosition={BetPosition.BEAR}
          isActive={betPosition === BetPosition.BEAR}
          hasEntered={hasEnteredDown}
        />
      </CardBody>
    </StyledExpiredRoundCard>
  )
}

export default ExpiredRoundCard
