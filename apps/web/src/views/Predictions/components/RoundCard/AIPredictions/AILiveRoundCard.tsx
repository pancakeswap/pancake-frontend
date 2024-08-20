import { useTranslation } from '@pancakeswap/localization'
import { BetPosition } from '@pancakeswap/prediction'
import { Card, CardBody, Flex, PlayCircleOutlineIcon, Text, useTooltip } from '@pancakeswap/uikit'
import { formatBigInt, formatNumber } from '@pancakeswap/utils/formatBalance'
import RoundProgress from 'components/RoundProgress'
import { useEffect, useMemo, useState } from 'react'
import { getHasRoundFailed } from 'state/predictions/helpers'
import { useGetBufferSeconds } from 'state/predictions/hooks'
import { NodeLedger, NodeRound } from 'state/types'
import styled from 'styled-components'
import { getNowInSeconds } from 'utils/getNowInSeconds'
import { usePredictionPrice } from 'views/Predictions/hooks/usePredictionPrice'
import { useConfig } from '../../../context/ConfigProvider'
import PositionTag from '../../PositionTag'
import { LockPriceRow, PrizePoolRow, RoundResultBox } from '../../RoundResult'
import CanceledRoundCard from '../CanceledRoundCard'
import LiveRoundPrice from '../LiveRoundPrice'
import MultiplierArrow from '../MultiplierArrow'
import { AICalculatingCard } from './AICalculatingCard'
import { AICardHeader } from './AICardHeader'
import { BetBadgeStack } from './BetBadgeStack'

const StyledCardBody = styled(CardBody)`
  position: relative;
  padding: 16px;
  background: linear-gradient(
    to bottom right,
    ${({ theme }) => theme.colors.primary3D},
    ${({ theme }) => theme.colors.inputSecondary}
  );
`

interface AILiveRoundCardProps {
  round: NodeRound
  betAmount?: NodeLedger['amount']
  hasEnteredFor: boolean // FOLLOWED AI's Prediction
  hasEnteredAgainst: boolean // AGAINST AI's Prediction
  formattedBullMultiplier: string
  formattedBearMultiplier: string
}

const REFRESH_PRICE_BEFORE_SECONDS_TO_CLOSE = 2

export const AILiveRoundCard: React.FC<React.PropsWithChildren<AILiveRoundCardProps>> = ({
  round,
  betAmount,
  hasEnteredFor,
  hasEnteredAgainst,
  formattedBullMultiplier,
  formattedBearMultiplier,
}) => {
  const { t } = useTranslation()
  const { lockPrice, totalAmount, lockTimestamp, closeTimestamp } = round
  const bufferSeconds = useGetBufferSeconds()
  const config = useConfig()

  // Fetch Live Price for AI Predictions Open and Live Round Cards
  const {
    data: { price },
    refetch,
  } = usePredictionPrice({
    currencyA: config?.token.symbol,
  })

  const [isCalculatingPhase, setIsCalculatingPhase] = useState(false)

  const isBull = Boolean(
    lockPrice && price > +formatBigInt(lockPrice, config?.displayedDecimals, config?.lockPriceDecimals ?? 8),
  )

  const betPosition = isBull ? BetPosition.BULL : BetPosition.BEAR

  const priceDifference =
    price - +formatBigInt(lockPrice ?? 0n, config?.displayedDecimals, config?.lockPriceDecimals ?? 8)

  const hasRoundFailed = getHasRoundFailed(round.oracleCalled, round.closeTimestamp, bufferSeconds, round.closePrice)

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    config?.ai
      ? t('Last price from Binance API')
      : config?.chainlinkOracleAddress
      ? t('Last price from Chainlink Oracle')
      : t('Last price from Pyth Oracle'),
    {
      placement: 'bottom',
    },
  )

  const aiPosition = useMemo(() => {
    if (!round.AIPrice || !round.lockPrice) return undefined

    const formattedLockPrice = +formatBigInt(round.lockPrice, 8, config?.lockPriceDecimals ?? 18) // note: lock price formatted with 8 decimals
    const formattedAIPrice = +formatBigInt(round.AIPrice, 8, config?.ai?.aiPriceDecimals ?? 18)

    return formattedAIPrice !== formattedLockPrice ? (formattedAIPrice > formattedLockPrice ? 'UP' : 'DOWN') : undefined
  }, [round.AIPrice, round.lockPrice, config?.ai?.aiPriceDecimals, config?.lockPriceDecimals])

  const userPosition = useMemo(() => {
    if ((hasEnteredFor && aiPosition === 'UP') || (hasEnteredAgainst && aiPosition === 'DOWN')) return 'UP'
    if ((hasEnteredFor && aiPosition === 'DOWN') || (hasEnteredAgainst && aiPosition === 'UP')) return 'DOWN'

    return undefined
  }, [aiPosition, hasEnteredFor, hasEnteredAgainst])

  // AI-based Prediction's Multiplier
  // If AI's prediction is UP, then BullMultiplier is AI's prediction and vice versa
  const bullMultiplier = aiPosition === 'UP' ? formattedBullMultiplier : formattedBearMultiplier
  const bearMultiplier = aiPosition === 'DOWN' ? formattedBullMultiplier : formattedBearMultiplier

  useEffect(() => {
    const secondsToClose = closeTimestamp ? closeTimestamp - getNowInSeconds() : 0
    if (secondsToClose > 0) {
      const refreshPriceTimeout = setTimeout(() => {
        // Fetch live price before round ends
        if (config?.ai?.useAlternateSource) {
          config.ai.useAlternateSource.current = true
          refetch()
        }
      }, (secondsToClose - REFRESH_PRICE_BEFORE_SECONDS_TO_CLOSE) * 1000)

      const calculatingPhaseTimeout = setTimeout(() => {
        setIsCalculatingPhase(true)
      }, secondsToClose * 1000)

      return () => {
        clearTimeout(refreshPriceTimeout)
        clearTimeout(calculatingPhaseTimeout)
        if (config?.ai?.useAlternateSource) {
          config.ai.useAlternateSource.current = false
        }
      }
    }
    return undefined
  }, [closeTimestamp, config, refetch])

  if (hasRoundFailed) {
    return <CanceledRoundCard round={round} />
  }

  if (isCalculatingPhase) {
    return <AICalculatingCard round={round} />
  }

  return (
    <Card isActive>
      <AICardHeader
        status="live"
        icon={<PlayCircleOutlineIcon mr="4px" width="24px" color="secondary" />}
        title={t('Live')}
        epoch={round.epoch}
      />
      <RoundProgress
        variant="flat"
        scale="sm"
        lockTimestamp={lockTimestamp ?? 0}
        closeTimestamp={closeTimestamp ?? 0}
      />
      <StyledCardBody>
        <BetBadgeStack aiBetType={aiPosition} userBetType={userPosition} betAmount={betAmount} />
        <MultiplierArrow betAmount={betAmount} multiplier={bullMultiplier} isActive={isBull} />
        <RoundResultBox betPosition={betPosition}>
          <Text color="textSubtle" fontSize="12px" bold textTransform="uppercase" mb="8px">
            {t('Last Price')}
          </Text>
          <Flex alignItems="center" justifyContent="space-between" mb="16px" height="36px">
            <div ref={targetRef}>
              <LiveRoundPrice
                betPosition={betPosition}
                price={price}
                displayedDecimals={config?.displayedDecimals ?? 4}
              />
            </div>
            <PositionTag betPosition={betPosition}>
              ${formatNumber(priceDifference, config?.displayedDecimals ?? 4, 4)}
            </PositionTag>
          </Flex>
          {lockPrice ? lockPrice?.toString() && <LockPriceRow lockPrice={lockPrice} /> : null}
          <PrizePoolRow totalAmount={totalAmount} />
        </RoundResultBox>
        <MultiplierArrow
          betAmount={betAmount}
          multiplier={bearMultiplier}
          betPosition={BetPosition.BEAR}
          isActive={!isBull}
        />
      </StyledCardBody>
      {tooltipVisible && tooltip}
    </Card>
  )
}
