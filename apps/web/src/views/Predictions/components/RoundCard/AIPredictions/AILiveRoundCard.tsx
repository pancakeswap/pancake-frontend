import { useTranslation } from '@pancakeswap/localization'
import { BetPosition } from '@pancakeswap/prediction'
import { Box, Card, CardBody, Flex, PlayCircleOutlineIcon, Text, useTooltip } from '@pancakeswap/uikit'
import { formatBigInt } from '@pancakeswap/utils/formatBalance'
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
  padding: 5px 6px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  z-index: 10;
  width: 100px;

  color: ${({ theme, $variant }) => ($variant === 'primary' ? theme.colors.white : theme.colors.secondary)};
  border-radius: ${({ theme }) => theme.radii.small};
  background-color: ${({ theme, $variant }) =>
    $variant === 'primary' ? theme.colors.secondary : theme.colors.invertedContrast};

  ${({ $type, $position }) =>
    $type === 'UP'
      ? `
    top: ${$position};
    `
      : `
    bottom: ${$position};
    `}
`

interface AILiveRoundCardProps {
  round: NodeRound
  betAmount?: NodeLedger['amount']
  hasEnteredFor: boolean // FOLLOWED AI's Prediction
  hasEnteredAgainst: boolean // AGAINST AI's Prediction
  bullMultiplier: string
  bearMultiplier: string

  livePrice: bigint
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
  return (
    <>
      {aiBetType && (
        <BetBadge $variant="primary" $type={aiBetType} $position={userBetType === 'DOWN' ? '40px' : aiBetPosition}>
          {t("AI's Bet")}
        </BetBadge>
      )}
      {userBetType && (
        <BetBadge $variant="secondary" $type={userBetType} $position={aiBetType === 'UP' ? '40px' : userBetPosition}>
          {t("Users's Bet")}
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
  livePrice,
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

  const liveAIPosition: 'UP' | 'DOWN' | undefined = useMemo(() => {
    // Accurate upto 8 decimals (if prices are equal at 8 decimals, it is considered a house win)
    const formattedAIPrice = parseFloat(formatBigInt(round.AIPrice ?? 0n, 8, 18))
    const formattedLivePrice = parseFloat(formatBigInt(livePrice ?? 0n, 8, 8)) // Chainlink price is 8 decimals on ARB's ETH/USD. TODO: Replace with CMC

    if (formattedAIPrice && formattedLivePrice)
      return formattedAIPrice === formattedLivePrice ? undefined : formattedAIPrice > formattedLivePrice ? 'UP' : 'DOWN'

    return undefined
  }, [livePrice, round.AIPrice])

  const userPosition: 'UP' | 'DOWN' | undefined = useMemo(() => {
    if ((hasEnteredFor && liveAIPosition === 'UP') || (hasEnteredAgainst && liveAIPosition === 'DOWN')) return 'UP'
    if ((hasEnteredFor && liveAIPosition === 'DOWN') || (hasEnteredAgainst && liveAIPosition === 'UP')) return 'DOWN'

    return undefined
  }, [hasEnteredFor, hasEnteredAgainst, liveAIPosition])

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
        <BetBadgeStack aiBetType="UP" userBetType="UP" />
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
