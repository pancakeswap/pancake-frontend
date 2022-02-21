import styled from 'styled-components'
import { Card, Box, BlockIcon, CardBody } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { NodeRound, BetPosition, NodeLedger } from 'state/types'
import { useGetBufferSeconds } from 'state/predictions/hooks'
import useTheme from 'hooks/useTheme'
import { getHasRoundFailed, getRoundPosition } from '../../helpers'
import { RoundResult } from '../RoundResult'
import MultiplierArrow from './MultiplierArrow'
import CardHeader, { getBorderBackground } from './CardHeader'
import CollectWinningsOverlay from './CollectWinningsOverlay'
import CanceledRoundCard from './CanceledRoundCard'
import CalculatingCard from './CalculatingCard'

interface ExpiredRoundCardProps {
  round: NodeRound
  betAmount?: NodeLedger['amount']
  hasEnteredUp: boolean
  hasEnteredDown: boolean
  hasClaimedUp: boolean
  hasClaimedDown: boolean
  bullMultiplier: string
  bearMultiplier: string
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
  hasClaimedUp,
  hasClaimedDown,
  bullMultiplier,
  bearMultiplier,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { epoch, lockPrice, closePrice } = round
  const betPosition = getRoundPosition(lockPrice, closePrice)
  const bufferSeconds = useGetBufferSeconds()
  const hasRoundFailed = getHasRoundFailed(round, bufferSeconds)

  if (hasRoundFailed) {
    return <CanceledRoundCard round={round} />
  }

  if (!closePrice) {
    return <CalculatingCard round={round} hasEnteredDown={hasEnteredDown} hasEnteredUp={hasEnteredUp} />
  }

  return (
    <Box position="relative">
      <StyledExpiredRoundCard borderBackground={getBorderBackground(theme, 'expired')}>
        <CardHeader
          status="expired"
          icon={<BlockIcon mr="4px" width="21px" color="textDisabled" />}
          title={t('Expired')}
          epoch={round.epoch}
        />
        <CardBody p="16px" style={{ position: 'relative' }}>
          <MultiplierArrow
            betAmount={betAmount}
            multiplier={bullMultiplier}
            isActive={betPosition === BetPosition.BULL}
            hasEntered={hasEnteredUp}
            hasClaimed={hasClaimedUp}
            isHouse={betPosition === BetPosition.HOUSE}
          />
          <RoundResult round={round} hasFailed={hasRoundFailed} />
          <MultiplierArrow
            betAmount={betAmount}
            multiplier={bearMultiplier}
            betPosition={BetPosition.BEAR}
            isActive={betPosition === BetPosition.BEAR}
            hasEntered={hasEnteredDown}
            hasClaimed={hasClaimedDown}
            isHouse={betPosition === BetPosition.HOUSE}
          />
        </CardBody>
      </StyledExpiredRoundCard>
      <CollectWinningsOverlay epoch={epoch} isBottom={hasEnteredDown} />
    </Box>
  )
}

export default ExpiredRoundCard
