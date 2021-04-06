import React from 'react'
import styled from 'styled-components'
import { BlockIcon, CardBody } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { Round, BetPosition } from 'state/types'
import { RoundResult } from '../RoundResult'
import MultiplierArrow from './MultiplierArrow'
import Card from './Card'
import CardHeader from './CardHeader'
import CollectWinningsOverlay from './CollectWinningsOverlay'

interface ExpiredRoundCardProps {
  round: Round
  hasEnteredUp: boolean
  hasEnteredDown: boolean
  bullMultiplier: number
  bearMultiplier: number
  claimed: boolean
  userBetPosition: BetPosition | null
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
  hasEnteredUp,
  hasEnteredDown,
  bullMultiplier,
  bearMultiplier,
  claimed,
  userBetPosition,
}) => {
  const TranslateString = useI18n()
  const { id, epoch, endBlock, lockPrice, closePrice } = round
  const betPosition = closePrice > lockPrice ? BetPosition.BULL : BetPosition.BEAR
  const hasEnteredRound = hasEnteredUp || hasEnteredDown
  const canClaim = userBetPosition === betPosition && !claimed

  return (
    <StyledExpiredRoundCard>
      <CardHeader
        status="expired"
        icon={<BlockIcon mr="4px" width="21px" color="textDisabled" />}
        title={TranslateString(999, 'Expired')}
        blockNumber={endBlock}
        epoch={round.epoch}
      />
      <CardBody p="16px" style={{ position: 'relative' }}>
        {hasEnteredRound && canClaim && <CollectWinningsOverlay roundId={id} epoch={epoch} isBottom={hasEnteredDown} />}
        <MultiplierArrow
          multiplier={bullMultiplier}
          isActive={betPosition === BetPosition.BULL}
          hasEntered={hasEnteredUp}
        />
        <RoundResult round={round} />
        <MultiplierArrow
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
