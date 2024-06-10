import { useTranslation } from '@pancakeswap/localization'
import { BetPosition } from '@pancakeswap/prediction'
import {
  Box,
  Card,
  CardBody,
  CheckmarkCircleFillIcon,
  Flex,
  PlayCircleOutlineIcon,
  Text,
  useTooltip,
} from '@pancakeswap/uikit'
import RoundProgress from 'components/RoundProgress'
import { useEffect, useMemo, useState } from 'react'
import { getHasRoundFailed } from 'state/predictions/helpers'
import { useGetBufferSeconds } from 'state/predictions/hooks'
import { NodeLedger, NodeRound } from 'state/types'
import styled from 'styled-components'
import { getNowInSeconds } from 'utils/getNowInSeconds'
import usePollOraclePrice from 'views/Predictions/hooks/usePollOraclePrice'
import { useConfig } from '../../../context/ConfigProvider'
import { formatUsdv2, getPriceDifference } from '../../../helpers'
import PositionTag from '../../PositionTag'
import { LockPriceRow, PrizePoolRow, RoundResultBox } from '../../RoundResult'
import CalculatingCard from '../CalculatingCard'
import CanceledRoundCard from '../CanceledRoundCard'
import LiveRoundPrice from '../LiveRoundPrice'
import MultiplierArrow from '../MultiplierArrow'
import { AICardHeader } from './AICardHeader'

const StyledCardBody = styled(CardBody)`
  position: relative;
  padding: 16px;
  background: linear-gradient(
    to bottom right,
    ${({ theme }) => theme.colors.primary3D},
    ${({ theme }) => theme.colors.inputSecondary}
  );
`

const BetBadge = styled(Box)<{ $variant?: 'primary' | 'secondary'; $type?: 'UP' | 'DOWN'; $position?: string }>`
  position: absolute;
  right: 20px;
  width: 70px;

  padding: 4px 0;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  user-select: none;
  z-index: 10;

  display: flex;
  align-items: center;

  color: ${({ theme, $variant }) => ($variant === 'primary' ? theme.colors.white : theme.colors.secondary)};
  border-radius: ${({ theme }) => theme.radii.small};
  background-color: ${({ theme, $variant }) =>
    $variant === 'primary' ? theme.colors.secondary : theme.colors.invertedContrast};

  border: ${({ theme, $variant }) => ($variant === 'secondary' ? `2px solid ${theme.colors.secondary}` : 'none')};
  border-left: none;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;

  ${({ $type, $position }) =>
    $type === 'UP'
      ? `
    top: ${$position};
    `
      : `
    bottom: ${$position};
  `}

  &:before {
    content: '';
    width: 0;
    height: 0;

    position: absolute;
    left: ${({ $variant }) => ($variant === 'primary' ? '-1rem' : '-0.85rem')};

    border-top: 0.7rem solid transparent;
    border-bottom: 0.7rem solid transparent;
    border-right: ${({ theme, $variant }) =>
      $variant === 'primary'
        ? `1rem solid ${theme.colors.secondary}`
        : `0.9rem solid ${theme.colors.invertedContrast}`};

    z-index: 10;
  }

  &:after {
    content: '';
    width: 0;
    height: 0;

    position: absolute;
    left: -1rem;

    border-top: 0.85rem solid transparent;
    border-bottom: 0.85rem solid transparent;
    border-right: 1rem solid
      ${({ theme, $variant }) => ($variant === 'secondary' ? theme.colors.secondary : 'transparent')};

    z-index: 9;
  }
`

interface AILiveRoundCardProps {
  round: NodeRound
  betAmount?: NodeLedger['amount']
  hasEnteredFor: boolean // FOLLOWED AI's Prediction
  hasEnteredAgainst: boolean // AGAINST AI's Prediction
  bullMultiplier: string
  bearMultiplier: string

  liveAIPosition: 'UP' | 'DOWN' | undefined
  userPosition: 'UP' | 'DOWN' | undefined
}

const REFRESH_PRICE_BEFORE_SECONDS_TO_CLOSE = 2

const SHOW_HOUSE_BEFORE_SECONDS_TO_CLOSE = 20

interface BetBadgeStackProps {
  aiBetType?: 'UP' | 'DOWN'
  aiBetPosition?: string

  userBetType?: 'UP' | 'DOWN'
  userBetPosition?: string
}

const BetBadgeStack = ({
  aiBetPosition = '20px',
  userBetPosition = '20px',
  aiBetType,
  userBetType,
}: BetBadgeStackProps) => {
  const { t } = useTranslation()

  const {
    tooltip: aiTooltip,
    tooltipVisible: aiTooltipVisible,
    targetRef: aiTargetRef,
  } = useTooltip(t("AI's prediction"))

  const {
    tooltip: userTooltip,
    tooltipVisible: userTooltipVisible,
    targetRef: userTargetRef,
  } = useTooltip(t('My position: %position% AI', { position: userBetType === aiBetType ? t('Follow') : t('Against') }))

  return (
    <>
      {aiBetType && (
        <BetBadge
          ref={aiTargetRef}
          $variant="primary"
          $type={aiBetType}
          $position={aiBetType !== userBetType || userBetType === 'DOWN' ? '46px' : aiBetPosition}
        >
          <img src="/images/predictions-temp/glass-globe.svg" alt="AI" width={14} />
          <span style={{ margin: '0 0 0 3px' }}>{t("AI's Bet")}</span>
          {aiTooltipVisible && aiTooltip}
        </BetBadge>
      )}
      {userBetType && (
        <BetBadge
          ref={userTargetRef}
          $variant="secondary"
          $type={userBetType}
          $position={aiBetType !== userBetType || aiBetType === 'UP' ? '40px' : userBetPosition}
        >
          <CheckmarkCircleFillIcon color="secondary" width={14} />
          <span style={{ margin: '0.5px 0 0 3px' }}>{t('My Bet')}</span>
          {userTooltipVisible && userTooltip}
        </BetBadge>
      )}
    </>
  )
}

export const AILiveRoundCard: React.FC<React.PropsWithChildren<AILiveRoundCardProps>> = ({
  round,
  betAmount,
  hasEnteredFor,
  hasEnteredAgainst,
  bullMultiplier,
  bearMultiplier,
  liveAIPosition,
  userPosition,
}) => {
  const { t } = useTranslation()
  const { lockPrice, totalAmount, lockTimestamp, closeTimestamp } = round
  const bufferSeconds = useGetBufferSeconds()
  const config = useConfig()
  const { price, refresh } = usePollOraclePrice({
    chainlinkOracleAddress: config?.chainlinkOracleAddress,
    galetoOracleAddress: config?.galetoOracleAddress,
  })

  const [isCalculatingPhase, setIsCalculatingPhase] = useState(false)

  const isHouse = useMemo(() => {
    const secondsToClose = closeTimestamp ? closeTimestamp - getNowInSeconds() : 0
    return Boolean(lockPrice && price === lockPrice && secondsToClose <= SHOW_HOUSE_BEFORE_SECONDS_TO_CLOSE)
  }, [closeTimestamp, lockPrice, price])

  const isBull = Boolean(lockPrice && price > lockPrice)

  const betPosition = isHouse ? BetPosition.HOUSE : isBull ? BetPosition.BULL : BetPosition.BEAR

  const priceDifference = getPriceDifference(price, lockPrice ?? 0n)
  const hasRoundFailed = getHasRoundFailed(round.oracleCalled, round.closeTimestamp, bufferSeconds, round.closePrice)

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    config?.chainlinkOracleAddress ? t('Last price from Chainlink Oracle') : t('Last price from Pyth Oracle'),
    {
      placement: 'bottom',
    },
  )

  useEffect(() => {
    const secondsToClose = closeTimestamp ? closeTimestamp - getNowInSeconds() : 0
    if (secondsToClose > 0) {
      const refreshPriceTimeout = setTimeout(() => {
        refresh()
      }, (secondsToClose - REFRESH_PRICE_BEFORE_SECONDS_TO_CLOSE) * 1000)

      const calculatingPhaseTimeout = setTimeout(() => {
        setIsCalculatingPhase(true)
      }, secondsToClose * 1000)

      return () => {
        clearTimeout(refreshPriceTimeout)
        clearTimeout(calculatingPhaseTimeout)
      }
    }
    return undefined
  }, [refresh, closeTimestamp])

  if (hasRoundFailed) {
    return <CanceledRoundCard round={round} />
  }

  if (isCalculatingPhase) {
    // TODO: Think about AI prediction logic here
    return <CalculatingCard round={round} hasEnteredDown={hasEnteredAgainst} hasEnteredUp={hasEnteredFor} />
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
        <BetBadgeStack aiBetType={liveAIPosition} userBetType={userPosition} />
        <MultiplierArrow
          betAmount={betAmount}
          multiplier={bullMultiplier}
          isActive={isHouse ? false : isBull}
          isHouse={isHouse}
        />
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
              {formatUsdv2(priceDifference, config?.displayedDecimals ?? 0)}
            </PositionTag>
          </Flex>
          {lockPrice?.toString() && <LockPriceRow lockPrice={lockPrice} />}
          <PrizePoolRow totalAmount={totalAmount} />
        </RoundResultBox>
        <MultiplierArrow
          betAmount={betAmount}
          multiplier={bearMultiplier}
          betPosition={BetPosition.BEAR}
          isActive={isHouse ? false : !isBull}
          isHouse={isHouse}
        />
      </StyledCardBody>
      {tooltipVisible && tooltip}
    </Card>
  )
}
