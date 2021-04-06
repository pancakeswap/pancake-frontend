import React from 'react'
import styled, { DefaultTheme } from 'styled-components'
import { Box, Flex, FlexProps, Text } from '@pancakeswap-libs/uikit'
import { formatBnb, formatUsd } from 'views/Predictions/helpers'
import useI18n from 'hooks/useI18n'
import { BetPosition, Round } from 'state/types'

// PrizePoolRow
interface PrizePoolRowProps extends FlexProps {
  totalAmount: Round['totalAmount']
}

const getPrizePoolAmount = (totalAmount: PrizePoolRowProps['totalAmount']) => {
  if (!totalAmount) {
    return '0'
  }

  return formatBnb(totalAmount)
}

export const PrizePoolRow: React.FC<PrizePoolRowProps> = ({ totalAmount, ...props }) => {
  const TranslateString = useI18n()

  return (
    <Flex alignItems="center" justifyContent="space-between" {...props}>
      <Text bold>{TranslateString(999, 'Prize Pool')}:</Text>
      <Text bold>{`${getPrizePoolAmount(totalAmount)} BNB`}</Text>
    </Flex>
  )
}

// LockPriceRow
interface LockPriceRowProps extends FlexProps {
  lockPrice: Round['lockPrice']
}

export const LockPriceRow: React.FC<LockPriceRowProps> = ({ lockPrice, ...props }) => {
  const TranslateString = useI18n()

  return (
    <Flex alignItems="center" justifyContent="space-between" {...props}>
      <Text fontSize="14px">{TranslateString(999, 'Locked Price')}:</Text>
      <Text fontSize="14px">{`${formatUsd(lockPrice)}`}</Text>
    </Flex>
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

  if (betPosition === BetPosition.BULL) {
    return theme.colors.success
  }

  if (betPosition === BetPosition.BEAR) {
    return theme.colors.failure
  }

  return theme.colors.borderColor
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

export const RoundResultBox: React.FC<RoundResultBoxProps> = ({
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
