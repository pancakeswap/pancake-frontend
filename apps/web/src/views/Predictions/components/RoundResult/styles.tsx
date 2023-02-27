import { useMemo } from 'react'
import styled, { DefaultTheme } from 'styled-components'
import { BigNumber } from '@ethersproject/bignumber'
import { Box, Flex, FlexProps, Skeleton, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { BetPosition, NodeRound, Round } from 'state/types'
import { useConfig } from 'views/Predictions/context/ConfigProvider'
import { formatUsdv2, formatTokenv2, getRoundPosition, getPriceDifference } from '../../helpers'
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
  if (!totalAmount) {
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
  const { token, displayedDecimals } = useConfig()

  return (
    <Row {...props}>
      <Text bold>{t('Prize Pool')}:</Text>
      <Text bold>{`${getPrizePoolAmount(totalAmount, token.decimals, displayedDecimals)} ${token.symbol}`}</Text>
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
  const { token, displayedDecimals } = useConfig()

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
        <Text fontSize="12px" lineHeight="18px">{`${formatBnb(amount, displayedDecimals)} ${token.symbol}`}</Text>
      </Flex>
    </Row>
  )
}

interface LockPriceRowProps extends FlexProps {
  lockPrice: NodeRound['lockPrice']
}

export const LockPriceRow: React.FC<React.PropsWithChildren<LockPriceRowProps>> = ({ lockPrice, ...props }) => {
  const { t } = useTranslation()
  const { displayedDecimals } = useConfig()

  return (
    <Row {...props}>
      <Text fontSize="14px">{t('Locked Price')}:</Text>
      <Text fontSize="14px">{formatUsdv2(lockPrice, displayedDecimals)}</Text>
    </Row>
  )
}

// RoundResultBox
interface RoundResultBoxProps {
  betPosition?: BetPosition
  isNext?: boolean
  isLive?: boolean
  hasEntered?: boolean
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

const StyledRoundResultBox = styled.div`
  background: ${({ theme }) => theme.card.background};
  border-radius: 14px;
  padding: 16px;
`

export const RoundResultBox: React.FC<React.PropsWithChildren<RoundResultBoxProps>> = ({
  isNext = false,
  hasEntered = false,
  isLive = false,
  children,
  ...props
}) => {
  return (
    <Background isNext={isNext} hasEntered={hasEntered} isLive={isLive} {...props}>
      <StyledRoundResultBox>{children}</StyledRoundResultBox>
    </Background>
  )
}

interface RoundPriceProps {
  lockPrice: BigNumber
  closePrice: BigNumber
}

export const RoundPrice: React.FC<React.PropsWithChildren<RoundPriceProps>> = ({ lockPrice, closePrice }) => {
  const { displayedDecimals } = useConfig()
  const betPosition = getRoundPosition(lockPrice, closePrice)
  const priceDifference = getPriceDifference(closePrice, lockPrice)

  const textColor = useMemo(() => {
    switch (betPosition) {
      case BetPosition.BULL:
        return 'success'
      case BetPosition.BEAR:
        return 'failure'
      case BetPosition.HOUSE:
      default:
        return 'textDisabled'
    }
  }, [betPosition])

  return (
    <Flex alignItems="center" justifyContent="space-between" mb="16px">
      {closePrice ? (
        <Text color={textColor} bold fontSize="24px">
          {formatUsdv2(closePrice, displayedDecimals)}
        </Text>
      ) : (
        <Skeleton height="34px" my="1px" />
      )}
      <PositionTag betPosition={betPosition}>{formatUsdv2(priceDifference, displayedDecimals)}</PositionTag>
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
  const { token, displayedDecimals } = useConfig()

  return (
    <Row {...props}>
      <Text bold>{t('Prize Pool')}:</Text>
      <Text bold>{`${getPrizePoolAmountHistory(totalAmount, displayedDecimals)} ${token.symbol}`}</Text>
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
  const { displayedDecimals } = useConfig()

  return (
    <Row {...props}>
      <Text fontSize="14px">{t('Locked Price')}:</Text>
      <Text fontSize="14px">{formatUsd(lockPrice, displayedDecimals)}</Text>
    </Row>
  )
}
/**
 * END TEMPORARY COMPONENTS
 */
