import React from 'react'
import styled, { DefaultTheme } from 'styled-components'
import { Box, Flex, FlexProps, Text } from '@rug-zombie-libs/uikit'
import { formatBnb, formatUsd } from 'views/Mausoleum/helpers'
import { useTranslation } from 'contexts/Localization'
import { BetPosition, Round } from 'state/types'
import { BigNumber } from 'bignumber.js'
import { auctionById, zmbeBnbLpPriceBnb } from '../../../../redux/get'
import { formatNumber, getBalanceAmount } from '../../../../utils/formatBalance'

// PrizePoolRow
interface PrizePoolRowProps extends FlexProps {
  totalAmount: Round['totalAmount'],
  bt?: boolean
}

const getPrizePoolAmount = (totalAmount: PrizePoolRowProps['totalAmount']) => {
  if (!totalAmount) {
    return '0'
  }

  return formatBnb(totalAmount)
}

export const PrizePoolRow: React.FC<PrizePoolRowProps> = ({ totalAmount,bt, ...props }) => {
  const { t } = useTranslation()

  return (
    <Flex alignItems='center' justifyContent='space-between' {...props}>
      <Text bold>{t('Bid Value')}:</Text>
      <Text bold>{`${getPrizePoolAmount(totalAmount)} ${bt ? "BT" : "BNB"}`}</Text>
    </Flex>
  )
}

// LockPriceRow
interface LockPriceRowProps  {
  bid: any;
  id: number;
}

export const LockPriceRow: React.FC<LockPriceRowProps> = ({ id , bid, ...props }) => {
  const { t } = useTranslation()
  const quarterBid = bid.amount / 4
  const { version } = auctionById(id)

  return (
    <>
      <Flex alignItems='center' justifyContent='space-between' {...props}>
        <Text fontSize='14px'>{t('ZMBE Burned')}:</Text>
        <Text fontSize='14px'>{formatNumber(getBalanceAmount(zmbeBnbLpPriceBnb().times(quarterBid * 3)).toNumber())}</Text>
      </Flex>
      <Flex alignItems='center' justifyContent='space-between' {...props}>
        <Text fontSize='14px'>{t('LP Locked')}:</Text>
        <Text fontSize='14px'>{Math.round(getBalanceAmount(new BigNumber(quarterBid)).toNumber() * 100) / 100} { version === 'v3' ? 'BNB' : 'BT'}</Text>
      </Flex>
    </>
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

export const RoundResultBox: React.FC<RoundResultBoxProps> = ({ children}) => {
  return (
    <Background >
      <StyledRoundResultBox>{children}</StyledRoundResultBox>
    </Background>
  )
}
