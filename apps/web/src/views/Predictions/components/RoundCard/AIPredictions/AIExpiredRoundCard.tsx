import { useTranslation } from '@pancakeswap/localization'
import { BetPosition } from '@pancakeswap/prediction'
import { BlockIcon, Box, Card, CardBody } from '@pancakeswap/uikit'
import { formatBigInt } from '@pancakeswap/utils/formatBalance'
import useTheme from 'hooks/useTheme'
import { useMemo } from 'react'
import { getHasRoundFailed } from 'state/predictions/helpers'
import { useGetBufferSeconds } from 'state/predictions/hooks'
import { NodeLedger, NodeRound } from 'state/types'
import { styled } from 'styled-components'
import { useConfig } from 'views/Predictions/context/ConfigProvider'
import { getRoundPosition } from '../../../helpers'
import { RoundResult } from '../../RoundResult'
import CanceledRoundCard from '../CanceledRoundCard'
import CardHeader, { getBorderBackground } from '../CardHeader'
import CollectWinningsOverlay from '../CollectWinningsOverlay'
import MultiplierArrow from '../MultiplierArrow'
import { AICalculatingCard } from './AICalculatingCard'
import { AIEnteredTag } from './AIEnteredTag'
import { BetBadgeStack } from './BetBadgeStack'

interface AIExpiredRoundCardProps {
  round: NodeRound
  betAmount?: NodeLedger['amount']
  hasEnteredUp: boolean
  hasEnteredDown: boolean
  hasClaimedUp: boolean
  hasClaimedDown: boolean
  formattedBullMultiplier: string
  formattedBearMultiplier: string
  isActive?: boolean
}

const StyledExpiredRoundCard = styled(Card)`
  opacity: 0.7;
  transition: opacity 300ms;

  &:hover {
    opacity: 1;
  }
`

const EnteredTagWrapper = styled.div`
  position: absolute;
  left: 20px;
  z-index: 1;
`

export const AIExpiredRoundCard: React.FC<React.PropsWithChildren<AIExpiredRoundCardProps>> = ({
  round,
  betAmount,
  hasEnteredUp,
  hasEnteredDown,
  hasClaimedUp,
  hasClaimedDown,
  formattedBullMultiplier,
  formattedBearMultiplier,
  isActive,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const config = useConfig()
  const { epoch, lockPrice, closePrice, AIPrice } = round
  const betPosition = getRoundPosition(lockPrice ?? 0n, closePrice ?? 0n) // Only need for UP/DOWN, not related to AI's bet
  const bufferSeconds = useGetBufferSeconds()
  const hasRoundFailed = getHasRoundFailed(round.oracleCalled, round.closeTimestamp, bufferSeconds, round.closePrice)

  const aiPosition = useMemo(() => {
    if (!AIPrice || !lockPrice) return undefined

    const formattedLockPrice = +formatBigInt(lockPrice, 8, config?.lockPriceDecimals ?? 18)
    const formattedAIPrice = +formatBigInt(AIPrice, 8, config?.ai?.aiPriceDecimals ?? 18)

    return formattedAIPrice !== formattedLockPrice ? (formattedAIPrice > formattedLockPrice ? 'UP' : 'DOWN') : undefined
  }, [AIPrice, lockPrice, config?.ai?.aiPriceDecimals, config?.lockPriceDecimals])

  const userPosition = useMemo(() => {
    // hasEnteredUp => Following AI
    // hasEnteredDown => Against AI

    if ((hasEnteredUp && aiPosition === 'UP') || (hasEnteredDown && aiPosition === 'DOWN')) return 'UP'
    if ((hasEnteredUp && aiPosition === 'DOWN') || (hasEnteredDown && aiPosition === 'UP')) return 'DOWN'

    return undefined
  }, [aiPosition, hasEnteredUp, hasEnteredDown])

  // AI-based Prediction's Multiplier
  // If AI's prediction is UP, then BullMultiplier is AI's prediction and vice versa
  const bullMultiplier = aiPosition === 'UP' ? formattedBullMultiplier : formattedBearMultiplier
  const bearMultiplier = aiPosition === 'DOWN' ? formattedBullMultiplier : formattedBearMultiplier

  if (hasRoundFailed) {
    return <CanceledRoundCard round={round} />
  }

  if (!closePrice) {
    return <AICalculatingCard round={round} />
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
          <BetBadgeStack aiBetType={aiPosition} userBetType={userPosition} betAmount={betAmount} />
          {(hasClaimedUp || hasClaimedDown) && (
            <EnteredTagWrapper style={userPosition === 'UP' ? { top: '20px' } : { bottom: '20px' }}>
              <AIEnteredTag
                amount={betAmount}
                multiplier={userPosition === aiPosition ? bullMultiplier : bearMultiplier}
                hasClaimed
              />
            </EnteredTagWrapper>
          )}
          <MultiplierArrow
            betAmount={betAmount}
            multiplier={bullMultiplier}
            isActive={betPosition === BetPosition.BULL}
            isHouse={betPosition === BetPosition.HOUSE}
          />
          <RoundResult round={round} hasFailed={hasRoundFailed} />
          <MultiplierArrow
            betAmount={betAmount}
            multiplier={bearMultiplier}
            betPosition={BetPosition.BEAR}
            isActive={betPosition === BetPosition.BEAR}
            isHouse={betPosition === BetPosition.HOUSE}
          />
        </CardBody>
      </StyledExpiredRoundCard>
      <CollectWinningsOverlay epoch={epoch} isBottom={userPosition === 'DOWN'} />
    </Box>
  )
}
