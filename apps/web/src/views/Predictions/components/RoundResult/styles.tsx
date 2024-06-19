import { useTranslation } from '@pancakeswap/localization'
import { BetPosition } from '@pancakeswap/prediction'
import { Box, Flex, FlexProps, Skeleton, Text } from '@pancakeswap/uikit'
import { formatBigInt } from '@pancakeswap/utils/formatBalance'
import { useMemo } from 'react'
import { NodeRound, Round } from 'state/types'
import { DefaultTheme, styled } from 'styled-components'
import { useConfig } from 'views/Predictions/context/ConfigProvider'
import { formatTokenv2, getPriceDifference, getRoundPosition } from '../../helpers'
import { formatBnb, formatUsd } from '../History/helpers'
import PositionTag from '../PositionTag'

// PrizePoolRow
interface PrizePoolRowProps extends FlexProps {
  totalAmount: NodeRound['totalAmount']
}

const getPrizePoolAmount = (
  totalAmount: PrizePoolRowProps['totalAmount'],
  decimals: number,
  displayedDecimals: number,
) => {
  if (typeof totalAmount !== 'bigint') {
    return '0'
  }

  return formatTokenv2(totalAmount, decimals, displayedDecimals)
}

const Row = ({ children, ...props }) => {
  return (
    <Flex alignItems="center" justifyContent="space-between" {...props}>
      {children}
    </Flex>
  )
}

export const PrizePoolRow: React.FC<React.PropsWithChildren<PrizePoolRowProps>> = ({ totalAmount, ...props }) => {
  const { t } = useTranslation()
  const config = useConfig()

  return (
    <Row {...props}>
      <Text bold>{t('Prize Pool')}:</Text>
      <Text bold>{`${getPrizePoolAmount(
        totalAmount,
        config?.token?.decimals ?? 0,
        config?.balanceDecimals ?? config?.displayedDecimals ?? 0,
      )} ${config?.token?.symbol}`}</Text>
    </Row>
  )
}

// Payout Row
interface PayoutRowProps extends FlexProps {
  positionLabel: string
  multiplier: number
  amount: number
}

export const PayoutRow: React.FC<React.PropsWithChildren<PayoutRowProps>> = ({
  positionLabel,
  multiplier,
  amount,
  ...props
}) => {
  const { t } = useTranslation()
  const formattedMultiplier = `${multiplier.toLocaleString(undefined, { maximumFractionDigits: 2 })}x`
  const config = useConfig()

  return (
    <Row height="18px" {...props}>
      <Text fontSize="12px" textTransform="uppercase">
        {positionLabel}:
      </Text>
      <Flex alignItems="center">
        <Text fontSize="12px" lineHeight="18px" bold>
          {t('%multiplier% Payout', { multiplier: formattedMultiplier })}
        </Text>
        <Text mx="4px">|</Text>
        <Text fontSize="12px" lineHeight="18px">{`${formatBnb(amount, config?.displayedDecimals ?? 0)} ${
          config?.token?.symbol
        }`}</Text>
      </Flex>
    </Row>
  )
}

interface LockPriceRowProps extends FlexProps {
  lockPrice: bigint
}

export const LockPriceRow: React.FC<React.PropsWithChildren<LockPriceRowProps>> = ({ lockPrice, ...props }) => {
  const { t } = useTranslation()
  const config = useConfig()
  return (
    <Row {...props}>
      <Text fontSize="14px">{t('Locked Price')}:</Text>
      <Text fontSize="14px">
        {formatUsd(Number(formatBigInt(lockPrice, 8, config?.lockPriceDecimals ?? 8)), config?.displayedDecimals ?? 0)}
      </Text>
    </Row>
  )
}

// RoundResultBox
interface RoundResultBoxProps {
  betPosition?: BetPosition
  isNext?: boolean
  isLive?: boolean
  hasEntered?: boolean

  innerPadding?: string | null
}

const getBackgroundColor = ({
  theme,
  betPosition,
  isNext,
  isLive,
  hasEntered,
}: RoundResultBoxProps & { theme: DefaultTheme }) => {
  if (isNext) {
    return 'linear-gradient(180deg, #53DEE9 0%, #7645D9 100%)'
  }

  if (hasEntered || isLive) {
    return theme.colors.secondary
  }

  switch (betPosition) {
    case BetPosition.BULL:
      return theme.colors.success
    case BetPosition.BEAR:
      return theme.colors.failure
    case BetPosition.HOUSE:
      return theme.colors.textDisabled
    default:
      return theme.colors.cardBorder
  }
}

const Background = styled(Box)<RoundResultBoxProps>`
  background: ${getBackgroundColor};
  border-radius: 16px;
  padding: 2px;
`

const StyledRoundResultBox = styled.div<{ $padding?: string }>`
  background: ${({ theme }) => theme.card.background};
  border-radius: 14px;
  padding: ${({ $padding }) => $padding || '16px'};
`

export const RoundResultBox: React.FC<React.PropsWithChildren<RoundResultBoxProps>> = ({
  isNext = false,
  hasEntered = false,
  isLive = false,
  innerPadding = '',
  children,
  ...props
}) => {
  return (
    <Background isNext={isNext} hasEntered={hasEntered} isLive={isLive} {...props}>
      <StyledRoundResultBox $padding={innerPadding || ''}>{children}</StyledRoundResultBox>
    </Background>
  )
}

interface RoundPriceProps {
  lockPrice: bigint | null
  closePrice: bigint | null
  AIPrice?: bigint | null
}

export const RoundPrice: React.FC<React.PropsWithChildren<RoundPriceProps>> = ({ lockPrice, closePrice, AIPrice }) => {
  const config = useConfig()
  const priceDifference = getPriceDifference(closePrice, lockPrice)
  const betPosition = getRoundPosition(lockPrice, closePrice) // To show UP/DOWN only and not related to AI bet
  const betPositionAI = getRoundPosition(lockPrice, closePrice, AIPrice) // In case of House win, display color according to AI won or lost

  const finalBetPosition = AIPrice && betPosition === BetPosition.HOUSE ? betPositionAI : betPosition

  const textColor = useMemo(() => {
    switch (finalBetPosition) {
      case BetPosition.BULL:
        return 'success'
      case BetPosition.BEAR:
        return 'failure'
      case BetPosition.HOUSE:
      default:
        return 'textDisabled'
    }
  }, [finalBetPosition])

  return (
    <Flex alignItems="center" justifyContent="space-between" mb="16px">
      {closePrice ? (
        <Text color={textColor} bold fontSize="24px">
          {formatUsd(
            Number(formatBigInt(closePrice, 8, config?.closePriceDecimals ?? 8)),
            config?.displayedDecimals ?? 0,
          )}
        </Text>
      ) : (
        <Skeleton height="34px" my="1px" />
      )}
      {finalBetPosition && (
        <PositionTag betPosition={finalBetPosition}>
          {formatUsd(
            Number(formatBigInt(priceDifference, 8, config?.closePriceDecimals ?? 8)), // Ideally both closePriceDecimals and lockPriceDecimals should be same
            config?.displayedDecimals ?? 0,
          )}
        </PositionTag>
      )}
    </Flex>
  )
}

/**
 * TODO: Remove
 *
 * This is a temporary function until we consolidate the data coming from the graph versus the node
 */
interface PrizePoolHistoryRowProps extends FlexProps {
  totalAmount: number
}

const getPrizePoolAmountHistory = (totalAmount: PrizePoolHistoryRowProps['totalAmount'], displayedDecimals: number) => {
  if (!totalAmount) {
    return '0'
  }

  return formatBnb(totalAmount, displayedDecimals)
}

export const PrizePoolHistoryRow: React.FC<React.PropsWithChildren<PrizePoolHistoryRowProps>> = ({
  totalAmount,
  ...props
}) => {
  const { t } = useTranslation()
  const config = useConfig()

  return (
    <Row {...props}>
      <Text bold>{t('Prize Pool')}:</Text>
      <Text bold>{`${getPrizePoolAmountHistory(
        totalAmount,
        config?.balanceDecimals ?? config?.displayedDecimals ?? 0,
      )} ${config?.token?.symbol}`}</Text>
    </Row>
  )
}

interface LockPriceHistoryRowProps extends FlexProps {
  lockPrice: Round['lockPrice']
}

export const LockPriceHistoryRow: React.FC<React.PropsWithChildren<LockPriceHistoryRowProps>> = ({
  lockPrice,
  ...props
}) => {
  const { t } = useTranslation()
  const config = useConfig()

  return (
    <Row {...props}>
      <Text fontSize="14px">{t('Locked Price')}:</Text>
      <Text fontSize="14px">{formatUsd(lockPrice, config?.displayedDecimals ?? 0)}</Text>
    </Row>
  )
}
/**
 * END TEMPORARY COMPONENTS
 */
