import { useTranslation } from '@pancakeswap/localization'
import { BetPosition } from '@pancakeswap/prediction'
import { BlockIcon, Box, Card, CardBody } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { getHasRoundFailed } from 'state/predictions/helpers'
import { useGetBufferSeconds } from 'state/predictions/hooks'
import { NodeLedger, NodeRound } from 'state/types'
import { styled } from 'styled-components'
import { getRoundPosition } from '../../helpers'
import { RoundResult } from '../RoundResult'
import CalculatingCard from './CalculatingCard'
import CanceledRoundCard from './CanceledRoundCard'
import CardHeader, { getBorderBackground } from './CardHeader'
import CollectWinningsOverlay from './CollectWinningsOverlay'
import MultiplierArrow from './MultiplierArrow'

interface ExpiredRoundCardProps {
  round: NodeRound
  betAmount?: NodeLedger['amount']
  hasEnteredUp: boolean
  hasEnteredDown: boolean
  hasClaimedUp: boolean
  hasClaimedDown: boolean
  bullMultiplier: string
  bearMultiplier: string
  isActive?: boolean
}

const StyledExpiredRoundCard = styled(Card)`
  opacity: 0.7;
  transition: opacity 300ms;

  &:hover {
    opacity: 1;
  }
`

const ExpiredRoundCard: React.FC<React.PropsWithChildren<ExpiredRoundCardProps>> = ({
  round,
  betAmount,
  hasEnteredUp,
  hasEnteredDown,
  hasClaimedUp,
  hasClaimedDown,
  bullMultiplier,
  bearMultiplier,
  isActive,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { epoch, lockPrice, closePrice } = round
  const betPosition = getRoundPosition(lockPrice ?? 0n, closePrice ?? 0n)
  const bufferSeconds = useGetBufferSeconds()
  const hasRoundFailed = getHasRoundFailed(round.oracleCalled, round.closeTimestamp, bufferSeconds, round.closePrice)

  if (hasRoundFailed) {
    return <CanceledRoundCard round={round} />
  }

  if (!closePrice) {
    return <CalculatingCard round={round} hasEnteredDown={hasEnteredDown} hasEnteredUp={hasEnteredUp} />
  }

  const cardProps = isActive
    ? {
        isActive,
      }
    : {
        borderBackground: getBorderBackground(theme, 'expired'),
      }

  return (
    <Box position="relative">
      <StyledExpiredRoundCard {...cardProps}>
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
